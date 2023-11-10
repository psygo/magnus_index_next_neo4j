import { Paper } from "@mui/material";

import { NodeObject } from "react-force-graph-2d";

import { FloatingPage } from "../../../(routes)/components/Floating";

export type FloatingPageProps = {
  clickedNode: NodeObject;
};

export function PageBubble({
  clickedNode,
}: FloatingPageProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "absolute",
        display: clickedNode ? "block" : "none",
        top: 10,
        left: 10,
        zIndex: 10,
        maxWidth: "275px",
        p: 1.5,
      }}
    >
      <FloatingPage clickedNode={clickedNode} />
    </Paper>
  );
}
