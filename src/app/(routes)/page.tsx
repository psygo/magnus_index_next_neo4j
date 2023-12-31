"use client";

import dynamic from "next/dynamic";

import { useGraphData } from "@hooks/exports";

/**
 * References:
 *
 * - [React Force Graph Issue #136](https://github.com/vasturiano/react-force-graph/issues/136)
 * - [NextJS Issue #33848](https://github.com/vercel/next.js/issues/33848)
 */
const NoSSRForceGraph2D = dynamic(
  () =>
    import("@components/Graphs/Graph2d").then(
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
