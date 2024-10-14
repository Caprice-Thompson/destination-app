import { apiClient } from "../api/apiClient";
import { Volcano } from "../types";

export const getVolcanoList = async (): Promise<Volcano> => {
  const url = `www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?page=5`;
  const response = await apiClient<any>(url);

  const volcanoList: Volcano = {
    id: response.items.id,
    name: response.items.name,
    location: response.items.location,
    country: response.items.country,
  };

  return volcanoList;
};
