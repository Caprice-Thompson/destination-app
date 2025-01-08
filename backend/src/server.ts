import express, { Request, Response } from "express";
import { getCountryAndTourismData, getEQParams, getNaturalHazardData } from "./utils/helper";
import cors from "cors";
import { AppError } from "./utils/errorHandler";
import { CountryService } from "./services/CountryService";
import { VolcanoService } from "./services/VolcanoService";
import { launchEarthquakeService } from "./services/EarthquakeService";
import { getGeoCoordinates } from "./utils/getGeoCoordinates";
import { TourismService } from "./services/TourismService";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.set("port", PORT);

const handleError = (res: Response, message: string, error: any) => {
  console.error(message, error);
  res.status(500).json({ error: "Internal Server Error" });
};

app.get("/", async (req: Request, res: Response) => {
  try {
    const country = "Spain";
    const month = 6;

    const [hazardData, countryTourismData] = await Promise.all([
      getNaturalHazardData(country, month),
      getCountryAndTourismData(country),
    ]);

    const combinedData = { ...hazardData, ...countryTourismData };
    res.json(combinedData);
  } catch (error) {
    handleError(
      res,
      "Error fetching natural hazard data for root route:",
      error
    );
  }
});

// API Endpoint
app.get(
  "/api/getCountryService",
  async (req: Request, res: Response): Promise<any> => {
    const country = req.query.country as string;
    if (!country) {
      throw new AppError(400, 'Country parameter is required');
    }

    try {
      const countryService = new CountryService(country);
      const cityPopulation = await countryService.getCityPopulation();
      const countryDetails = await countryService.getCountryDetails();

      const combinedData = { ...cityPopulation, ...countryDetails };
      res.json(combinedData);
    } catch (error) {
      throw new AppError(500, 'Internal Server Error');
    }
  }
);

app.get("/api/getTourismService", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  if (!country) {
    throw new AppError(400, 'Country parameter is required');
  }

  try {
    const tourismService = new TourismService(country);
    const thingsToDo = await tourismService.thingsToDoList();
    const unescoSites = await tourismService.getUNESCOSitesList();

    res.json({
      message: "Tourism service executed successfully!",
      data: {
        thingsToDo,
        unescoSites
      }
    });
  } catch (error) {
    throw new AppError(500, 'Internal Server Error');
  }
});

// Earthquake Service Endpoint
app.get("/api/getEarthquakeService", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  const month = req.query.month as string;

  if (!country || !month) {
    throw new AppError(400, 'Country and month parameters are required.');
  }

  try {
    const coordinates = await getGeoCoordinates(country);
    const params = getEQParams(coordinates!);
    const earthquakeApiUrl = process.env.EQ_BASE_URL ?? "";
    const earthquakeService = launchEarthquakeService(earthquakeApiUrl, params);
    const earthquakeData = await earthquakeService.getEarthquakeData();
    const eqAverages = earthquakeService.calculateEarthquakeStatistics(
      earthquakeData,
      parseInt(month, 10)
    );

    res.json({
      message: "Earthquake service executed successfully!",
      data: {
        earthquakeData,
        eqAverages
      }
    });
  } catch (error) {
    throw new AppError(500, 'Internal Server Error');
  }
});

// Volcano Service Endpoint
app.get("/api/getVolcanoService", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  if (!country) {
    throw new AppError(400, 'Country parameter is required');
  }

  try {
    const volcanoService = new VolcanoService();
    const volcanoesByCountry = await volcanoService.getVolcanoByCountry(country);

    res.json({
      message: "Volcano service executed successfully!",
      data: volcanoesByCountry
    });
  } catch (error) {
    throw new AppError(500, 'Internal Server Error');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
