import { Chip, Stack, Typography } from "@mui/material";
import { Tag as TagIcon } from "@mui/icons-material";

import { TagProperties } from "@models/exports";

export function TagFloatingText({
  tagProperties,
}: {
  tagProperties: TagProperties;
}) {
  return (
    <Stack alignItems="center" spacing={1}>
      <Chip
        icon={<TagIcon />}
        color="primary"
        label="Tag"
        size="small"
        sx={{
          p: "5px",
          maxWidth: "max-content",
          backgroundColor: "darkcyan",
          "& .MuiChip-label": {
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      />
      <Typography fontWeight="bold">
        {tagProperties.title}
      </Typography>
    </Stack>
  );
}
