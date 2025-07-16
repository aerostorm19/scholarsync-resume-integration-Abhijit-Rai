import cheerio from "cheerio";

export async function scrapeScholarProfile(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Scholar profile");

  const html = await response.text();
  const $ = cheerio.load(html);

  const name = $("#gsc_prf_in").text().trim();
  const affiliation = $(".gsc_prf_il").first().text().trim();
  const interests = $(".gsc_prf_ila").map((_, el) => $(el).text()).get();

  const stats = $("td.gsc_rsb_std").map((_, el) => $(el).text()).get(); // citations, h-index, i10-index

  const publications = $(".gsc_a_tr").map((_, el) => {
    const title = $(el).find(".gsc_a_at").text().trim();
    const authors = $(el).find(".gsc_a_at").parent().next().text().trim();
    const venue = $(el).find(".gsc_a_at").parent().next().next().text().trim();
    const year = $(el).find(".gsc_a_y").text().trim();
    const citations = $(el).find(".gsc_a_c").text().trim();

    return { title, authors, venue, year, citations };
  }).get();

  return {
    name,
    affiliation,
    hIndex: stats[2],
    i10Index: stats[4],
    citations: stats[0],
    interests,
    publications,
  };
}
