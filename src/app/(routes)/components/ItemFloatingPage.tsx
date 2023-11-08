import { Stack, Typography } from "@mui/material";

import { ItemProperties } from "@/lib/models/graph";

export function ItemFloatingPage({
  itemProperties,
}: {
  itemProperties: ItemProperties;
}) {
  return (
    <Stack>
      <Typography>{itemProperties.title}</Typography>
    </Stack>
  );
}
