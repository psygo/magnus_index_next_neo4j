"use client";

import { useEffect, useState } from "react";

import { Graph2d } from "../api/graph/components/Graph2d";

export function useGraphData() {
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

  return data;
}

export default function Page() {
  const data = useGraphData();

  return <main>{data && <Graph2d data={data} />}</main>;
}
