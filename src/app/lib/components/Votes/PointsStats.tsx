import { Icon, Stack, Typography } from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  ModeStandby,
} from "@mui/icons-material";

import { WithPoints } from "@/lib/models/exports";

export function PointsStats({
  pointsProperties,
}: {
  pointsProperties: WithPoints;
}) {
  return (
    <Stack direction="row" spacing={1}>
      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ModeStandby />
        </Icon>
        <Typography fontWeight="bold">
          {pointsProperties.points}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ArrowUpward sx={{ color: "green" }} />
        </Icon>
        <Typography color="green">
          {pointsProperties.points_up}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ArrowDownward sx={{ color: "red" }} />
        </Icon>
        <Typography color="red">
          {pointsProperties.points_down}
        </Typography>
      </Stack>
    </Stack>
  );
}
