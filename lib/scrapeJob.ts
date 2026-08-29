import * as cheerio from "cheerio";

export async function scrapeJobUrl(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; PortfolioCopilot/1.0; +https://example.com)"
    },
    next: { revalidate: 900 }
  });

  if (!response.ok) {
    throw new Error("Could not fetch job page");
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  $("script, style, nav, header, footer, noscript").remove();

  const meta = $('meta[name="description"]').attr("content") ?? "";
  const title = $("title").first().text();
  const body = $("body").text().replace(/\s+/g, " ").trim();

  return [title, meta, body].filter(Boolean).join("\n\n").slice(0, 12000);
}

