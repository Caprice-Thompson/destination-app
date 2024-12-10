import express, { Request, Response } from "express";
import cors from "cors";
import { NaturalHazardService } from "./services/NaturalHazardService";
import { getCountryDetails } from "./country/country";
import { Country, ThingsToDo, Population, WorldHeritageSiteData } from "./types";
import { CountryService } from "./services/CountryService";
import { getPopulation, getThingsToDo, getWorldHeritageSites } from "../prisma/dbQueries";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route -  root invoke the natural hazard service 
//or redirect to api endpoint
/**
 * app.get("/", (req: Request, res: Response) => {
    const location = "Spain";
    const targetMonth = 1;
    res.redirect(`/api/natural-hazard?location=${location}&targetMonth=${targetMonth}`);
});
 */
// Or normal route
/**
 *    app.get("/", (req: Request, res: Response) => {
       res.send("Welcome to the Natural Hazard API Backend!");
   });
 */
app.get("/", async (req: Request, res: Response) => {
    try {
        const naturalHazardData = await NaturalHazardService("Spain", 1);
        const countryData = await CountryService({
            getCountryDetails: getCountryDetails as (location: string) => Promise<Country>,
            getThingsToDo: getThingsToDo as (location: string) => Promise<ThingsToDo[]>,
            getPopulation: getPopulation as (country: string) => Promise<Population[]>,
            getWorldHeritageSites: getWorldHeritageSites as (country: string) => Promise<WorldHeritageSiteData[]>,
        }).getCountryService("Spain");
        console.log(countryData);
        const combinedData = {
            naturalHazardData,
            countryData
        };

        res.json(combinedData);
    } catch (error) {
        console.error("Error fetching natural hazard data for root route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API Endpoint
app.get("/api/natural-hazard", async (req: Request, res: Response) => {
    const { location, targetMonth } = req.query;

    if (!location || !targetMonth) {
        res.status(400).json({ error: "Missing location or targetMonth parameter" });
        return;
    }

    try {
        const data = await NaturalHazardService(
            String(location),
            Number(targetMonth)
        );
        res.json(data);
    } catch (error) {
        console.error("Error fetching natural hazard data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});