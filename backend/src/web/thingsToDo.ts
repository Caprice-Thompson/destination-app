import axios from "axios";
import * as cheerio from "cheerio";
import { ThingsToDo } from "../types";
import prisma from "../prisma/prismaClient";

// TODO: Run a cron job
const getDescription = (
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

const validateLocation = (location: string): string | null => {
  const match = location.match(/(.*?)\s*\(\d+\)$/);
  return match ? match[1].trim() : null;
};

function getCountryText(element: cheerio.Cheerio): string | null {
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

export async function getThingsToDoData(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results: ThingsToDo[] = [];

    $("div.paragraph span > span > font").each((_, element) => {
      const anchor = $(element).find("a");
      const anchorText = anchor.text().trim();
      const remainingText = $(element).contents().not("a").text().trim();
      const countryText = `${anchorText} ${remainingText}`.trim();
      const location = validateLocation(countryText);

      if (location) {
        const items: string[] = [];
        const nextUl = $(element).closest("span").parent().next("ul");

        if (nextUl.length) {
          getDescription(nextUl, items, $);
        }

        if (!results.some((item) => item.location === location)) {
          results.push({ location, item: items });
        }
      }
    });

    $("div.paragraph span > font > span").each((_, element) => {
      const fullCountryText = getCountryText($(element));
      const validatedCountry = fullCountryText
        ? validateLocation(fullCountryText)
        : null;

      if (validatedCountry) {
        const items: string[] = [];
        const nextUl = $(element).closest("font").parent().next("ul");
        getDescription(nextUl, items, $);

        if (!results.some((item) => item.location === validatedCountry)) {
          results.push({ location: validatedCountry, item: items });
        }
      }
    });

    const thingsToDoData = results.map((result) =>
      prisma.thingToDo.create({
        data: {
          location: result.location,
          item: result.item,
        },
      })
    );
    await Promise.all(thingsToDoData);
    console.log(`Successfully merged data for things to do and written to db`);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}
