import _ from "lodash";

import { NextResponse } from "next/server";

import puppeteer, { Browser } from "puppeteer";

type Link = string;
type Node = Link;
type Edge = [Link, Link];
type Graph = {
  nodes: Node[];
  edges: Edge[];
};

async function recursiveExploreWebsite(
  link: string,
  browser: Browser,
  level: number = 1,
  graph: Graph = { nodes: [], edges: [] }
) {
  if (level < 3 && link.includes("https://fanaro.io")) {
    console.log(level);
    console.log(link);

    const page = await browser.newPage();
    await page.goto(link, {
      waitUntil: "networkidle0",
    });

    const newLinks = await page.evaluate(() =>
      Array.from(document.links).map((l) => l.href)
    );
    const slicedNewLinks = newLinks.slice(0, 5);

    const newEdges = newLinks.map((l) => [link, l]);
    const mergedNodes = _.merge(
      graph.nodes,
      slicedNewLinks
    );
    const mergedEdges = _.merge(graph.edges, newEdges);
    const newGraph: Graph = {
      nodes: mergedNodes,
      edges: mergedEdges,
    };

    for (const l of slicedNewLinks) {
      await recursiveExploreWebsite(
        l,
        browser,
        level + 1,
        newGraph
      );
    }
  }

  return graph;
}

export async function POST() {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });

    const graph = await recursiveExploreWebsite(
      "https://fanaro.io",
      browser
    );

    await browser.close();

    return NextResponse.json(
      { data: graph },
      { status: 201 }
    );
  } catch (e) {
    return new NextResponse(
      "Not able to scrape the website",
      {
        status: 204,
      }
    );
  }
}
