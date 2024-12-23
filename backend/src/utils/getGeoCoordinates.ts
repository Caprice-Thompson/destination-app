import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";

export type Coordinates = {
  latt: string;
  longt: string;
};

export const getGeoCoordinates = async (
  country: string
): Promise<Coordinates | void> => {
  const auth = process.env.GEO_TOKEN ?? "";
  const base = process.env.GEO_ENDPOINT ?? "";
  const params = {
    json: 1,
    auth: auth,
  };

  const geoURL = getCustomURL.getParams(base, params, country);
  const response = await getData<Coordinates>(geoURL);
  if (!response) {
    console.error("Failed to retrieve coordinates");
    return;
  }

  return {
    latt: response.latt,
    longt: response.longt,
  };
};
