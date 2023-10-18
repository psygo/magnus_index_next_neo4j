import { Box, Typography } from "@mui/material";

import {
  Connection,
  Item,
  User,
} from "../../lib/models/graph";

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

export function Connection({ title }: Connection) {
  return (
    <Box>
      <Typography>{title}</Typography>
    </Box>
  );
}
