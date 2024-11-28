import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";

export type Coordinates = {
  latt: string;
  longt: string;
};

export const getGeoCoordinates = async (
  location: string
): Promise<Coordinates | null> => {
  const auth = process.env.GEO_TOKEN ?? "";
  const base = process.env.GEO_ENDPOINT ?? "";
  const params = {
    json: 1,
    auth: auth,
  };

  const geoURL = getCustomURL.getParams(base, params, location);
  const response = await getData<Coordinates>(geoURL);
  if (!response) {
    console.error("Failed to retrieve coordinates");
    return null;
  }

  return {
    latt: response.latt,
    longt: response.longt,
  };
};
