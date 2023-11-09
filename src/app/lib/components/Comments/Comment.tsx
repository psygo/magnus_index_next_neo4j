import { Stack, Typography } from "@mui/material";

import {
  CommentProperties,
  UserProperties,
} from "@/lib/models/exports";

export function Comment({
  commentProperties,
  authorProperties,
}: {
  commentProperties: CommentProperties;
  authorProperties: UserProperties;
}) {
  return (
    <Stack spacing={1}>
      <Typography>{authorProperties.name}</Typography>
      <Typography>{commentProperties.content}</Typography>
    </Stack>
  );
}
