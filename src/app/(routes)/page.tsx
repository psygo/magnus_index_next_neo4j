"use client";

import { useGraphData } from "./utils/use_graph_data";

import dynamic from "next/dynamic";

const NoSSRForceGraph2D = dynamic(
  () =>
    import("./components/Graph2d").then(
      (module) => module.Graph2d
    ),
  { ssr: false }
);

export default function Page() {
  const data = useGraphData();

  return (
    <main>{data && <NoSSRForceGraph2D data={data} />}</main>
  );
}
