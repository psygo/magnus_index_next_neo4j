import { NextResponse } from "next/server";

import puppeteer from "puppeteer";

export async function POST() {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    await page.goto("https://fanaro.io", {
      waitUntil: "networkidle0",
    });

    const links = await page.evaluate(() =>
      Array.from(document.links).map((l) => l.href)
    );

    await browser.close();

    return NextResponse.json({ links }, { status: 201 });
  } catch (e) {
    return new NextResponse(
      "Not able to scrape the website",
      {
        status: 204,
      }
    );
  }
}
