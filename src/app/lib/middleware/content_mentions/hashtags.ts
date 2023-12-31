import { neo4jSession } from "@config/db";

import { Id } from "@models/utils/exports";

const tagRegex =
  /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
export function extractHashtags(text: string) {
  const matches = text.match(tagRegex);
  return matches?.map((t) => t.slice(1)) ?? [];
}

export async function createHashtagMentions(
  content: string,
  userId: Id,
  itemId: Id
) {
  try {
    const hashtags = extractHashtags(content);

    if (hashtags.length > 0) {
      for await (const hashtag of hashtags) {
        await neo4jSession.executeWrite((tx) =>
          tx.run(
            /* cypher */ `
              MATCH   (u:User{ ext_id: $userId })
                     -[:CREATED]
                    ->(i:Item{ ext_id: $itemId })

              MERGE (t:Tag{ title: $hashtag })
              
              SET t.created_at = TIMESTAMP()

              CREATE   (t)
                      -[:TAG_MENTIONS_BY]
                     ->(u)
                      -[:TAG_MENTIONS{ item_id: $itemId }]
                     ->(i)
                     
              RETURN t, u, i
            `,
            { hashtag, userId, itemId }
          )
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}
