"use client";

import { useGraphData } from "./utils/use_graph_data";

import { Graph2d } from "./components/Graph2d";

export default function Page() {
  const data = useGraphData();

  return <main>{data && <Graph2d data={data} />}</main>;
}
