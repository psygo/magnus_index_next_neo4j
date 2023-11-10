import { useEffect, useState } from "react";

import { API_URL } from "@config/api_config";

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
