import axios from "axios";
import { NaturalHazard } from "../../src/types";

export const fetchNaturalHazardData = async (
  location: string,
  targetMonth: number
): Promise<NaturalHazard> => {
  try {
    const response = await axios.get<NaturalHazard>("/api/natural-hazard", {
      params: { location, targetMonth },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching natural hazard data:", error);
    throw error;
  }
};