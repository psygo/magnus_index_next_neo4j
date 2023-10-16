"use client";

import { useEffect, useState } from "react";

import { API_URL } from "@/lib/config/api_config";

import { Graph2d } from "./components/Graph2d";

export function useGraphData() {
  const [data, setData] = useState();

  useEffect(() => {
    async function getGraphData() {
      const res = await fetch(`${API_URL}/graph`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
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
