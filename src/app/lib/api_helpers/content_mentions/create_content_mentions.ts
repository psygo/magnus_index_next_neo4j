import { Id } from "@/lib/models/graph";

import { createHashtagMentions } from "./hashtags";
import { createHyperlinkMentions } from "./hyperlinks";
import { createUserMentions } from "./user_mentions";

export async function createContentMentions(
  content: string,
  userId: Id,
  itemId: Id
) {
  await createHashtagMentions(content, userId, itemId);
  await createHyperlinkMentions(content, userId, itemId);
  await createUserMentions(content, itemId);
}
