import { Box, Typography } from "@mui/material";

import {
  Connection,
  Item,
  User,
} from "../../lib/models/graph";
import { NodeObject } from "react-force-graph-2d";

export function WhichHoverFloating({
  hoverNode,
}: {
  hoverNode: NodeObject;
}) {
  if (hoverNode.labels.includes("User")) {
    const userProps = hoverNode.properties as User;
    return (
      <UserFloatingText
        name={userProps.name}
        email={userProps.email}
      />
    );
  } else if (hoverNode.labels.includes("Item")) {
    const itemProps = hoverNode.properties as Item;
    return (
      <ItemFloatingText
        title={itemProps.title}
        content={itemProps.content}
      />
    );
  } else {
    const connectionProps =
      hoverNode.properties as Connection;
    return (
      <ConnectionFloatingText
        title={connectionProps.title}
      />
    );
  }
}

export function UserFloatingText({ email, name }: User) {
  return (
    <Box>
      <Typography>{email}</Typography>
      <Typography>{name}</Typography>
    </Box>
  );
}

export function ItemFloatingText({ title, content }: Item) {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{content}</Typography>
    </Box>
  );
}

export function ConnectionFloatingText({
  title,
}: Connection) {
  return (
    <Box>
      <Typography>{title}</Typography>
    </Box>
  );
}
