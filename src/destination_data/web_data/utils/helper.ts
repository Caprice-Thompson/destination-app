import { ThingsToDo } from "../../../types";

export const getDescription = (
  element: cheerio.Cheerio,
  item: string[],
  $: cheerio.Root
) => {
  if (!element || !element.length) return;

  element.find("li").each((_, liElement) => {
    const description = $(liElement)
      .find("span > font > span, span > span > font, font > span")
      .first()
      .text()
      .trim();

    if (description && !item.includes(description)) {
      item.push(description);
    }
  });
};

export const validateLocation = (location: string): string | null => {
  const match = location.match(/(.*?)\s*\(\d+\)$/);
  return match ? match[1].trim() : null;
};

export const validateElement = (
  element: string,
  getCountryText: string
): string => {
  const isNumberInParentheses: RegExp = /^\(\d+\)$/;
  if (isNumberInParentheses.test(element)) {
    const fullCountryText = `${getCountryText} ${element}`;
    const matchCountryText = fullCountryText.match(/(.*?)\s*\((\d+)\)$/);
    return matchCountryText ? matchCountryText[1] : fullCountryText;
  }

  return getCountryText;
};

export const duplicateResultsChecker = (
  results: ThingsToDo[],
  location: string,
  item: string[]
) => {
  const countryExists = results.some((item) => item.location === location);
  if (!countryExists) {
    results.push({ location, item });
  }
};

export function getCountryText(
  element: cheerio.Cheerio,
  $: cheerio.Root
): string | null {
  if (!element || !element.length) {
    console.warn("Invalid element provided");
    return null;
  }

  const countryText = element.text().trim();
  const nextText = element.next().text().trim();

  return /^\(\d+\)$/.test(nextText)
    ? `${countryText} ${nextText}`.trim()
    : countryText || null;
}
