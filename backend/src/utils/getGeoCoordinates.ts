import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";
import { AppError } from "./errorHandler";

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
    throw new AppError(404, 'Failed to retrieve coordinates');
  }

  return {
    latt: response.latt,
    longt: response.longt,
  };
};
