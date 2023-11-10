import { Paper } from "@mui/material";

import {
  FloatingText,
  FloatingTextProps,
  NodePos,
} from "../../../(routes)/components/Floating";

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