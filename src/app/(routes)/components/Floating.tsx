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
      sx={{
        position: "absolute",
        display: hoverNode ? "block" : "none",
        top: nodePos.y - 60,
        left: nodePos.x + 15,
        zIndex: 10,
        maxWidth: "300px",
        p: 2,
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

      <Stack direction="row" spacing={1}>
        <Stack direction="row" spacing={0.5}>
          <Icon>
            <ModeStandbyIcon />
          </Icon>
          <Typography fontWeight="bold">
            {userProperties.points}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <Icon>
            <ArrowUpward sx={{ color: "green" }} />
          </Icon>
          <Typography color="green">
            {userProperties.points_up}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <Icon>
            <ArrowDownward sx={{ color: "red" }} />
          </Icon>
          <Typography color="red">
            {userProperties.points_down}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export function ItemFloatingText({
  itemProperties,
}: {
  itemProperties: ItemProperties;
}) {
  return (
    <Box>
      <Typography>{itemProperties.title}</Typography>
      <Typography>{itemProperties.content}</Typography>
      <Typography>{itemProperties.points}</Typography>
    </Box>
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
