import express, { Request, Response } from "express";
import { simulateAPIGatewayEvent } from "./utils/helper";
import cors from "cors";
import { AppError } from "./utils/errorHandler";
import { getCountryServiceHandler } from "./handlers/country-service-handler";
import { Context } from "aws-lambda";
import { getTourismServiceHandler } from "./handlers/tourism-service-handler";
import { getEarthquakeServiceHandler } from "./handlers/earthquake-service-handler";
import { getVolcanoServiceHandler } from "./handlers/volcano-service-handler";

const app = express();
const PORT = process.env.PORT || 8080;
const context: Context = {} as Context;

// Middleware
app.use(cors());
app.use(express.json());
app.set("port", PORT);

const handleError = (res: Response, message: string, error: any) => {
  console.error(message, error);
  res.status(500).json({ error: "Internal Server Error" });
};

app.get("/api/getCountryData", async (req: Request, res: Response) => {
  const queryStringParameters = req.query;

  const event = simulateAPIGatewayEvent(
    "/api/getCountryData",
    queryStringParameters as { [key: string]: string },
    req.headers as { [key: string]: string }
  );

  try {
    const result = await getCountryServiceHandler(event, context);

    res.status(result.statusCode).send(result.body);
  } catch (err) {
    handleError(res, "Error occurred:", err);
  }
});

app.get("/api/getTourismData", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  if (!country) {
    throw new AppError(400, "Country parameter is required");
  }
  const event = simulateAPIGatewayEvent(
    "/api/getTourismData",
    req.query as { [key: string]: string },
    req.headers as { [key: string]: string }
  );
  try {
    const result = await getTourismServiceHandler(event, context);

    res.status(result.statusCode).send(result.body);
  } catch (error) {
    throw new AppError(500, "Internal Server Error");
  }
});

// Earthquake Service Endpoint
app.get("/api/getEarthquakeData", async (req: Request, res: Response) => {
  const country = req.query.country as string;
  const month = req.query.month as string;

  if (!country || !month) {
    throw new AppError(400, "Country and month parameters are required.");
  }
  const event = simulateAPIGatewayEvent(
    "/api/getEarthquakeData",
    req.query as { [key: string]: string },
    req.headers as { [key: string]: string }
  );
  try {
    const result = await getEarthquakeServiceHandler(event, context);
    res.status(result.statusCode).send(result.body);
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
  const event = simulateAPIGatewayEvent(
    "/api/getVolcanoData",
    req.query as { [key: string]: string },
    req.headers as { [key: string]: string }
  );
  try {
    const result = await getVolcanoServiceHandler(event, context);

    res.status(result.statusCode).send(result.body);
  } catch (error) {
    throw new AppError(500, "Internal Server Error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
