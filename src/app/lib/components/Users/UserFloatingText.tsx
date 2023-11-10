import { Chip, Stack, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

import { UserProperties } from "@models/exports";

import { PointsStats } from "@components/Votes/exports";

export function UserFloatingText({
  userProperties,
}: {
  userProperties: UserProperties;
}) {
  return (
    <Stack spacing={1}>
      <Chip
        icon={<AccountCircle />}
        color="primary"
        label="User"
        size="small"
        sx={{
          p: "5px",
          maxWidth: "max-content",
          backgroundColor: "purple",
          "& .MuiChip-label": {
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      />

      <Typography
        fontWeight="bold"
        sx={{ paddingLeft: "5px" }}
      >
        {userProperties.name}
      </Typography>

      <PointsStats
        pointsProperties={{
          points: userProperties.points,
          points_up: userProperties.points_up,
          points_down: userProperties.points_down,
        }}
      />
    </Stack>
  );
}
