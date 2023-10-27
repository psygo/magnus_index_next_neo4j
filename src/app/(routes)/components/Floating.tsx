import { Box, Paper, Typography } from "@mui/material";

import { NodeObject } from "react-force-graph-2d";

import {
  ConnectionProperties,
  ItemProperties,
  NeoNodeLabel,
  UserProperties,
} from "@/lib/models/graph";

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
    const userProps =
      hoverNode.properties as UserProperties;
    return (
      <UserFloatingText
        name={userProps.name}
        email={userProps.email}
      />
    );
  } else if (hoverNode.type === NeoNodeLabel.Item) {
    const itemProps =
      hoverNode.properties as ItemProperties;
    return (
      <ItemFloatingText
        title={itemProps.title}
        content={itemProps.content}
      />
    );
  } else {
    const connectionProps =
      hoverNode.properties as ConnectionProperties;
    return (
      <ConnectionFloatingText
        title={connectionProps.title}
      />
    );
  }
}

export function UserFloatingText({
  email,
  name,
}: UserProperties) {
  return (
    <Box>
      <Typography>{email}</Typography>
      <Typography>{name}</Typography>
    </Box>
  );
}

export function ItemFloatingText({
  title,
  content,
}: ItemProperties) {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{content}</Typography>
    </Box>
  );
}

export function ConnectionFloatingText({
  title,
}: ConnectionProperties) {
  return (
    <Box>
      <Typography>{title}</Typography>
    </Box>
  );
}
