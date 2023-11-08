import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";

import { Id, ItemProperties } from "@/lib/models/graph";

import { ItemFloatingText } from "./Floating";
import { API_URL } from "../../lib/config/api_config";

export function ItemFloatingPage({
  initialItemProperties,
  itemId,
}: {
  initialItemProperties: ItemProperties;
  itemId: Id;
}) {
  const [currentItemProperties, setItemProperties] =
    useState(initialItemProperties);

  const [completeItemData, setCompleteItemData] =
    useState();

  useEffect(() => {
    async function getItem() {
      const itemRes = await fetch(
        `${API_URL}/items/${itemId}`,
        {
          method: "Get",
          headers: { "Content-Type": "application/json" },
        }
      );

      const itemCompleteData = await itemRes.json();

      console.log(itemCompleteData);

      setCompleteItemData(itemCompleteData);
    }

    getItem();
  }, [itemId]);

  return (
    <Stack>
      <ItemFloatingText
        itemProperties={currentItemProperties}
      />
    </Stack>
  );
}
