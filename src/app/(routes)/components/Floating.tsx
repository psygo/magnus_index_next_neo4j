import {
  Box,
  Icon,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";

import { NodeObject } from "react-force-graph-2d";

import {
  ConnectionProperties,
  ItemProperties,
  NeoNodeLabel,
  PointsProperties,
  UserProperties,
} from "@/lib/models/graph";
import {
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";

type FloatingTextProps = {
  hoverNode: NodeObject;
};

export type NodePos = {
  x: number;
  y: number;
};

type HoverBubbleProps = FloatingTextProps & {
  nodePos: NodePos;
};

export function HoverBubble({
  hoverNode,
  nodePos,
}: HoverBubbleProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "absolute",
        display: hoverNode ? "block" : "none",
        top: nodePos.y - 60,
        left: nodePos.x + 15,
        zIndex: 10,
        maxWidth: "300px",
        p: 1.5,
      }}
    >
      <FloatingText hoverNode={hoverNode} />
    </Paper>
  );
}

export function FloatingText({
  hoverNode,
}: FloatingTextProps) {
  if (hoverNode.type === NeoNodeLabel.User) {
    const userProperties =
      hoverNode.properties as UserProperties;
    return (
      <UserFloatingText userProperties={userProperties} />
    );
  } else if (hoverNode.type === NeoNodeLabel.Item) {
    const itemProperties =
      hoverNode.properties as ItemProperties;
    return (
      <ItemFloatingText itemProperties={itemProperties} />
    );
  } else {
    const connectionProperties =
      hoverNode.properties as ConnectionProperties;
    return (
      <ConnectionFloatingText
        connectionProperties={connectionProperties}
      />
    );
  }
}

export function PointsStats({
  pointsProperties,
}: {
  pointsProperties: PointsProperties;
}) {
  return (
    <Stack direction="row" spacing={1}>
      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ModeStandbyIcon />
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

export function UserFloatingText({
  userProperties,
}: {
  userProperties: UserProperties;
}) {
  return (
    <Stack spacing={1}>
      <Typography sx={{ paddingLeft: "5px" }}>
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

export function ItemFloatingText({
  itemProperties,
}: {
  itemProperties: ItemProperties;
}) {
  return (
    <Stack spacing={1}>
      <Typography>{itemProperties.title}</Typography>

      <PointsStats
        pointsProperties={{
          points: itemProperties.points,
          points_up: itemProperties.points_up,
          points_down: itemProperties.points_down,
        }}
      />
    </Stack>
  );
}

export function ConnectionFloatingText({
  connectionProperties,
}: {
  connectionProperties: ConnectionProperties;
}) {
  return (
    <Box>
      <Typography>{connectionProperties.title}</Typography>
      <Typography>{connectionProperties.points}</Typography>
    </Box>
  );
}
