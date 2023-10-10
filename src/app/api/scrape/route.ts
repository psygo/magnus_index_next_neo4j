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
  if (level < 5 && link.includes("https://fanaro.io")) {
    console.log(level);
    console.log(link);

    const page = await browser.newPage();
    await page.goto(link, {});

    const newLinks = await page.evaluate(() =>
      Array.from(document.links).map((l) => l.href)
    );
    const slicedNewLinks = newLinks.slice(0, 20);

    const newEdges = slicedNewLinks.map((l) => [link, l]);
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

    const graph: Graph = {
      nodes: [],
      edges: [],
    };

    const g = await recursiveExploreWebsite(
      "https://fanaro.io",
      browser,
      1,
      graph
    );

    await browser.close();

    return NextResponse.json({ data: g }, { status: 201 });
  } catch (e) {
    return new NextResponse(
      "Not able to scrape the website",
      {
        status: 204,
      }
    );
  }
}
