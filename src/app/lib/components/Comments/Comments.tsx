import { Stack } from "@mui/material";

import { Comment } from "./Comment";

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
