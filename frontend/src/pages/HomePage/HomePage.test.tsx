import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { fetchAvailableCountries } from "../../api";

// Mock the API call
jest.mock("../../api", () => ({
  fetchAvailableCountries: jest.fn(),
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("HomePage Component", () => {
  const mockCountries = [
    "United States",
    "Canada",
    "Mexico",
    "Brazil",
    "Argentina",
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchAvailableCountries as jest.Mock).mockResolvedValue(
      mockCountries.map((country) => ({ country }))
    );
  });

  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  it("renders the home page with all required elements", async () => {
    renderHomePage();

    await waitFor(() => {
      expect(
        screen.getByText("Prepare for your next adventure...")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Enter country name...")
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Month")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  it("filters country suggestions based on input", async () => {
    renderHomePage();

    const countryInput = screen.getByPlaceholderText("Enter country name...");
    await userEvent.type(countryInput, "Uni");

    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument();
    });
  });

  it("handles month selection correctly", async () => {
    renderHomePage();
    const monthSelect = screen.getByLabelText("Month");
    await userEvent.selectOptions(monthSelect, "January");
    expect(monthSelect).toHaveValue("1");
  });

  it("should navigate to results page when button is clicked", async () => {
    renderHomePage();

    // Select country
    const countryInput = screen.getByPlaceholderText("Enter country name...");
    await userEvent.type(countryInput, "Canada");
    fireEvent.focus(countryInput);
    await waitFor(() => {
      const suggestion = screen.getByText("Canada");
      fireEvent.click(suggestion);
    });

    // Select month
    const monthSelect = screen.getByLabelText("Month");
    await userEvent.selectOptions(monthSelect, "January");

    // Submit form
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/results/Canada/1");
    });
  });
});
