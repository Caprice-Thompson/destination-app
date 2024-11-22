export async function scrapeDataWithRateLimits(
  urls: string | string[],
  callback: (url: string) => Promise<void>
) {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const urlArray = Array.isArray(urls) ? urls : [urls];

  for (let i = 0; i < urlArray.length; i++) {
    await callback(urlArray[i]);
    await delay(2000); // 2-second delay between requests
  }
}
