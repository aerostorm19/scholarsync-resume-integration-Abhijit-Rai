import puppeteer from "puppeteer";

export async function scrapeScholarProfile(profileUrl: string) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  );

  await page.goto(profileUrl, { waitUntil: "networkidle2", timeout: 30000 });

  const data = await page.evaluate(() => {
    const getText = (selector: string) =>
      document.querySelector(selector)?.textContent?.trim() || "";

    const getAllText = (selector: string) =>
      Array.from(document.querySelectorAll(selector)).map((el) => el.textContent?.trim() || "");

    const name = getText("#gsc_prf_in");
    const affiliation = document.querySelector(".gsc_prf_il")?.textContent?.trim() || "";
    const interests = getAllText(".gsc_prf_ila");

    const stats = Array.from(document.querySelectorAll("td.gsc_rsb_std")).map(
      (el) => el.textContent?.trim() || ""
    );

    const publications = Array.from(document.querySelectorAll(".gsc_a_tr"))
      .slice(0, 20)
      .map((el) => ({
        title: el.querySelector(".gsc_a_at")?.textContent?.trim() || "",
        year: el.querySelector(".gsc_a_y")?.textContent?.trim() || "",
        citations: el.querySelector(".gsc_a_c")?.textContent?.trim() || "",
      }));

    return {
      name,
      affiliation,
      interests,
      citations: stats[0],
      hIndex: stats[2],
      publications,
    };
  });

  await browser.close();
  return data;
}
