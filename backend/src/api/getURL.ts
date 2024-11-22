function buildUrl(
  base: string,
  path: string,
  queryParams: Record<string, string> = {}
): string {
  const fullUrl = new URL(path, base);

  if (Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams(queryParams);
    fullUrl.search = searchParams.toString();
  }

  return fullUrl.toString();
}
console.log(
  buildUrl("https://www.example.com", "/en-US/docs", {
    search: "query",
    page: "1",
  })
);
