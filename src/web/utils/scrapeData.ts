export async function scrapeDataWithRateLimits(
  urls: string[],
  callback: (url: string) => Promise<void>
) {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < urls.length; i++) {
    await callback(urls[i]); 
    await delay(2000); 
  }
}
