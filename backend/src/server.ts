// import express, { Request, Response } from "express";
// import cors from "cors";
// import { NaturalHazardService } from "./services/NaturalHazardService";

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Endpoint
// app.get("/api/natural-hazard", async (req: Request, res: Response) => {
//     const { location, targetMonth } = req.query;

//     if (!location || !targetMonth) {
//         res.status(400).json({ error: "Missing location or targetMonth parameter" });
//         return;
//     }

//     try {
//         const data = await NaturalHazardService(
//             String(location),
//             Number(targetMonth)
//         );
//         res.json(data);
//     } catch (error) {
//         console.error("Error fetching natural hazard data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });