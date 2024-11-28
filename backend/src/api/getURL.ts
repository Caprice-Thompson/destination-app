interface CustomURLParams {
  getParams<T>(url: string, customParams: T, endPointPath?: string): string;
}

export const getCustomURL: CustomURLParams = {
  getParams<T>(url: string, params: T, endPointPath?: string): string {
    const stringifiedParams: Record<string, string> = {};

    for (const key in params) {
      const value = params[key as keyof T]; 
      stringifiedParams[key.toLowerCase()] = String(value); 
    }

    const separator = url.includes("?") ? "&" : "?";

    const getParams = new URLSearchParams(stringifiedParams);
    const customURL = new URL(
      (endPointPath ?? "") + separator + getParams.toString(),
      url
    );
    console.log(customURL);
    return customURL.toString();
  },
};
