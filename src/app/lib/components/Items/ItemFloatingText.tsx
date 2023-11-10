import { Chip, Stack, Typography } from "@mui/material";
import { Description } from "@mui/icons-material";

import { ItemProperties } from "@models/exports";

import { capString } from "@components/utils";
import { PointsStats } from "@components/Votes/exports";

export function ItemFloatingText({
  itemProperties,
}: {
  itemProperties: ItemProperties;
}) {
  return (
    <Stack spacing={1}>
      <Chip
        icon={<Description />}
        color="primary"
        label="Item"
        size="small"
        sx={{
          p: "5px",
          maxWidth: "max-content",
          backgroundColor: "green",
          "& .MuiChip-label": {
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      />

      <Typography fontWeight="bold">
        {itemProperties.title}
      </Typography>

      <PointsStats
        pointsProperties={{
          points: itemProperties.points,
          points_up: itemProperties.points_up,
          points_down: itemProperties.points_down,
        }}
      />

      <Typography
        variant="caption"
        sx={{ wordWrap: "break-word" }}
      >
        {capString(itemProperties.content)}
      </Typography>
    </Stack>
  );
}
