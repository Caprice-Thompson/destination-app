import express, { Request, Response } from "express";
import { getEQParams } from "./utils/helper";
import cors from "cors";
import { AppError } from "./utils/errorHandler";
import { CountryDomain } from "./services/CountryService";
import { CountryRepo } from "./services/CountryService";
import { TourismDatabaseRepository } from "./services/TourismService";
import { TourismApplicationService } from "./services/TourismService";
import { EarthquakeService } from "./services/EarthquakeService";
import { EarthquakeDomain } from "./services/EarthquakeService";
import { getGeoCoordinates } from "./utils/getGeoCoordinates";
import { VolcanoService } from "./services/VolcanoService";

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

app.get("/api/getCountryData", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  if (!country) {
    throw new AppError(400, "Country parameter is required");
  }

  try {
    const countryRepo = new CountryRepo(country);
    const countryDomain = new CountryDomain(countryRepo);

    const countryData = await countryDomain.getCountryData(country);

    res.status(200).json({
      message: "Country data fetched successfully",
      data: countryData,
    });
  } catch (err) {
    handleError(res, "Error occurred:", err);
  }
});

app.get("/api/getTourismData", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  const tourismDatabaseRepo = new TourismDatabaseRepository();
  const tourismAppLayer = new TourismApplicationService(tourismDatabaseRepo);
  if (!country) {
    throw new AppError(400, "Country parameter is required");
  }

  try {
    const tourismData = await tourismAppLayer.getTourismData(country);

    res.status(200).json({
      message: "Tourism data fetched successfully",
      data: tourismData,
    });
  } catch (error) {
    throw new AppError(500, "Internal Server Error");
  }
});

// Earthquake Service Endpoint
app.get("/api/getEarthquakeData", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  const month = req.query.month as string;
  const monthInt = parseInt(month, 10);
  const coordinates = await getGeoCoordinates(country);
  const params = getEQParams(coordinates!);
  if (!country || !month) {
    throw new AppError(400, "Country and month parameters are required.");
  }

  try {
    const earthquakeRepo = new EarthquakeService(
      process.env.EQ_BASE_URL ?? "",
      params
    );

    const earthquakeDomain = new EarthquakeDomain(earthquakeRepo);
    const result = await earthquakeDomain.getEarthquakeData(country, monthInt);
    res.status(200).json({
      message: "Earthquake data fetched successfully",
      data: result,
    });
  } catch (error) {
    throw new AppError(500, "Internal Server Error");
  }
});

// Volcano Service Endpoint
app.get("/api/getVolcanoData", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  if (!country) {
    throw new AppError(400, "Country parameter is required");
  }

  try {
    const volcanoService = new VolcanoService();
    const volcanoesByCountry = await volcanoService.getVolcanoByCountry(
      country
    );

    res.status(200).json({
      message: "Volcano data fetched successfully",
      data: volcanoesByCountry,
    });
  } catch (error) {
    throw new AppError(500, "Internal Server Error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
