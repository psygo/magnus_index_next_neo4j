import { useState } from "react";

import {
  Button,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import { FloatingText } from "../../../(routes)/components/Floating";
import { ClickedNodesPair } from "@/lib/models/exports";

type CreateConnectionProps = {
  clickedNodes: ClickedNodesPair;
  connectTwoItems: () => Promise<void>;
};

export function CreateConnection({
  clickedNodes,
  connectTwoItems,
}: CreateConnectionProps) {
  const [connectionTitle, setConnectionTitle] =
    useState("");

  return (
    <form>
      <Stack
        sx={{
          position: "absolute",
          display: clickedNodes.second() ? "block" : "none",
          top: 10,
          right: 10,
          zIndex: 10,
          maxWidth: "300px",
          p: 2,
        }}
        spacing={2}
      >
        <TextField
          id="connection-title"
          type="text"
          label="Connection Title"
          variant="outlined"
          value={connectionTitle}
          onChange={(e) => {
            setConnectionTitle(e.target.value);
          }}
        />
        {clickedNodes.second() && (
          <Paper>
            <FloatingText
              hoverNode={clickedNodes.second()!}
            />
          </Paper>
        )}
        {clickedNodes.first() && (
          <Paper>
            <FloatingText
              hoverNode={clickedNodes.first()!}
            />
          </Paper>
        )}
        {clickedNodes.first() && clickedNodes.second() && (
          <Button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              await connectTwoItems();
            }}
          >
            Connect
          </Button>
        )}
      </Stack>
    </form>
  );
}
