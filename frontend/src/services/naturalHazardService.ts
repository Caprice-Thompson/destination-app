import axios from "axios";

export const fetchNaturalHazardData = async (
  location: string,
  targetMonth: number
): Promise<any> => {
  try {
    const response = await axios.get<any>("/api/natural-hazard", {
      params: { location, targetMonth },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching natural hazard data:", error);
    throw error;
  }
};