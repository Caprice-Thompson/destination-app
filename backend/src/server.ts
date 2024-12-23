import express, { Request, Response } from "express";
import { getCountryAndTourismData, getNaturalHazardData } from "./utils/helper";
import cors from "cors";

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
  "/api/natural-hazard",
  async (req: Request, res: Response): Promise<any> => {
    const { country, month } = req.query;
    console.log(req.query.country);
    console.log(req.query.month);
    if (!country || !month) {
      res.status(400).json({ error: "Missing country or month parameter" });
      return;
    }

    if (typeof country !== "string" || typeof month !== "string") {
      return res.status(400).json({ error: "Invalid parameter" });
    }

    if (isNaN(Number(month))) {
      return res.status(400).json({ error: "Invalid month parameter" });
    }
    const monthNumber = parseInt(month, 10);
    try {
      const [hazardData, countryTourismData] = await Promise.all([
        getNaturalHazardData(country, monthNumber),
        getCountryAndTourismData(country),
      ]);

      const combinedData = { ...hazardData, ...countryTourismData };
      res.json(combinedData);
    } catch (error) {
      console.error("Error fetching natural hazard data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
