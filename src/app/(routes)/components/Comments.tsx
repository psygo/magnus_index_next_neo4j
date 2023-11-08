import { Stack, Typography } from "@mui/material";

import {
  CommentProperties,
  UserProperties,
} from "@/lib/models/graph";

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

export function Comments({
  comments,
  authors,
  createdComments,
}: {
  comments: any[];
  authors: any[];
  createdComments: any[];
}) {
  const commentPairs = [];
  for (const c of createdComments) {
    const author = authors
      .filter((a) => a.id === c.source)
      .first();
    const comment = comments
      .filter((comm) => comm.id === c.target)
      .first();

    commentPairs.push({ author, comment });
  }

  console.log(commentPairs);

  return (
    <Stack spacing={2}>
      {commentPairs.map((cp, index) => (
        <Comment
          key={index.toString()}
          authorProperties={cp.author.properties}
          commentProperties={cp.comment.properties}
        />
      ))}
    </Stack>
  );
}
