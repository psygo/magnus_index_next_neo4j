"use client";

import { useEffect, useState } from "react";

import ForceGraph3D from "react-force-graph-3d";

export default function Page() {
  const [data, setData] = useState();

  useEffect(() => {
    async function getGraphData() {
      const res = await fetch(
        "http://localhost:3000/api/graph"
      );
      const data = await res.json();

      setData(data);
    }

    getGraphData();
  }, []);

  return (
    <main>
      <ForceGraph3D graphData={data} />,
    </main>
  );
}
