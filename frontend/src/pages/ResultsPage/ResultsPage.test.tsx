import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResultsPage from "./ResultsPage";
import {
  getCountryAndTourismData,
  getVolcanoAndEarthquakeData,
} from "../../api";
import { mockData } from "../../mockData";

// Mock the API calls
jest.mock("../../api", () => ({
  getCountryAndTourismData: jest.fn(),
  getVolcanoAndEarthquakeData: jest.fn(),
}));

// Mock the mockData
jest.mock("../../mockData", () => ({
  mockData: {
    countryData: {
      data: {
        countryDetails: {
          flag: "test-flag.png",
          capitalCity: ["Test Capital"],
          currencies: { USD: { name: "US Dollar", symbol: "$" } },
          languages: [{ name: "English" }],
        },
        cityPopulations: [{ city: "Test City", population: 1000000 }],
      },
    },
    tourismData: {
      data: {
        thingsToDoList: [{ item: ["Activity 1", "Activity 2"] }],
        unescoSitesList: [
          { site: "Test Site", description: "Test Description" },
        ],
      },
    },
    volcanoData: { data: [{ name: "Test Volcano" }] },
    earthquakeData: [
      {
        data: {
          earthquakeStatistics: {
            totalEarthquakes: 10,
            avgTsunamiCount: 2,
            avgMagnitude: 4.5,
            monthlyEarthquakePercentage: 15,
          },
          earthquakeData: [
            {
              name: "Test Earthquake",
              magnitude: 5.0,
              date: "2024-01-01",
              type: "Test Type",
            },
          ],
        },
      },
    ],
  },
}));

describe("ResultsPage", () => {
  const renderWithRouter = (
    countryName = "test-country",
    month = "january"
  ) => {
    return render(
      <MemoryRouter initialEntries={[`/results/${countryName}/${month}`]}>
        <Routes>
          <Route
            path="/results/:countryName/:month"
            element={<ResultsPage />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock responses
    (getCountryAndTourismData as jest.Mock).mockResolvedValue({
      countryData: mockData.countryData,
      tourismData: mockData.tourismData,
    });
    (getVolcanoAndEarthquakeData as jest.Mock).mockResolvedValue({
      volcanoData: mockData.volcanoData,
      earthquakeData: mockData.earthquakeData,
    });
  });

  it("should show loading state initially", async () => {
    // Mock the API calls to delay their resolution?? is there another way to do this?
    (getCountryAndTourismData as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    (getVolcanoAndEarthquakeData as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    await act(async () => {
      renderWithRouter();
    });

    // Wait for the loading element to be present
    await waitFor(() => {
      const loadingElement = screen.getByText("Loading...");
      expect(loadingElement).toBeInTheDocument();
      expect(loadingElement).toHaveClass("loading");
    });
  });

  it("should show error message when API calls fail", async () => {
    const originalError = console.error;
    console.error = jest.fn();

    (getCountryAndTourismData as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    await act(async () => {
      renderWithRouter();
    });

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching data:",
      expect.any(Error)
    );
    console.error = originalError;
  });

  it("should render country information correctly", async () => {
    await act(async () => {
      renderWithRouter();
    });

    await waitFor(() => {
      // Check country details
      expect(screen.getByText("Discover test-country")).toBeInTheDocument();
      expect(screen.getByText("Test Capital")).toBeInTheDocument();
      expect(screen.getByText("US Dollar")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();

      // Check city information
      expect(screen.getByText("Test City")).toBeInTheDocument();
      expect(screen.getByText("Population: 1,000,000")).toBeInTheDocument();

      // Check earthquake statistics
      expect(screen.getByText("Total Earthquakes")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("Tsunami Count")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("4.5")).toBeInTheDocument();

      // Check tourism information
      expect(screen.getByText("Activity 1")).toBeInTheDocument();
      expect(screen.getByText("Activity 2")).toBeInTheDocument();
      expect(screen.getByText("Test Site")).toBeInTheDocument();

      // Check volcano information
      expect(screen.getByText("Test Volcano")).toBeInTheDocument();

      // Check earthquake details
      expect(screen.getByText("Test Earthquake")).toBeInTheDocument();
    });
  });

  it("should handle missing optional data sections", async () => {
    const partialData = {
      countryData: mockData.countryData,
      tourismData: { data: { thingsToDoList: [], unescoSitesList: [] } },
      volcanoData: { data: [] },
      earthquakeData: mockData.earthquakeData,
    };

    (getCountryAndTourismData as jest.Mock).mockResolvedValueOnce({
      countryData: partialData.countryData,
      tourismData: partialData.tourismData,
    });
    (getVolcanoAndEarthquakeData as jest.Mock).mockResolvedValueOnce({
      volcanoData: partialData.volcanoData,
      earthquakeData: partialData.earthquakeData,
    });

    await act(async () => {
      renderWithRouter();
    });

    await waitFor(() => {
      // Verify that the component still renders with available data
      expect(screen.getByText("Discover test-country")).toBeInTheDocument();
      expect(screen.getByText("Test Capital")).toBeInTheDocument();
      // Verify that missing sections don't cause errors
      expect(
        screen.queryByText("UNESCO World Heritage Sites")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Volcanoes")).not.toBeInTheDocument();
    });
  });
});
