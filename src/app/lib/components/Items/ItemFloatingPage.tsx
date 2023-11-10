import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import { API_URL } from "@/lib/config/api_config";

import {
  Id,
  ItemProperties,
  NeoLinkLabel,
  NeoNodeLabel,
} from "@models/exports";

import { Comments } from "@components/Comments/exports";
import { ItemFloatingText } from "@components/Items/exports";

export function ItemFloatingPage({
  initialItemProperties,
  itemId,
}: {
  initialItemProperties: ItemProperties;
  itemId: Id;
}) {
  const [currentItemProperties, setItemProperties] =
    useState(initialItemProperties);

  const [completeItemData, setCompleteItemData] = useState<{
    links: any[];
    nodes: any[];
  }>();

  useEffect(() => {
    async function getItem() {
      const itemRes = await fetch(
        `${API_URL}/items/${itemId}`,
        {
          method: "Get",
          headers: { "Content-Type": "application/json" },
        }
      );

      const itemCompleteData = (await itemRes.json()) as {
        links: any[];
        nodes: any[];
      };

      setCompleteItemData(itemCompleteData);
    }

    getItem();
  }, [itemId]);

  return (
    <Stack spacing={3}>
      <ItemFloatingText
        itemProperties={currentItemProperties}
      />
      {completeItemData && (
        <Comments
          comments={completeItemData?.nodes.filter(
            (n) => n.type === NeoNodeLabel.Comment
          )}
          authors={completeItemData?.nodes.filter(
            (n) => n.type === NeoNodeLabel.User
          )}
          createdComments={completeItemData?.links.filter(
            (n) => n.type === NeoLinkLabel.CreatedComment
          )}
        />
      )}
    </Stack>
  );
}
