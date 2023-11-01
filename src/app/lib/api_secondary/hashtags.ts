import { neo4jSession } from "../config/db";

import { Id } from "../models/graph";

const tagRegex =
  /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/g;
export function extractHashtags(text: string) {
  const matches = text.match(tagRegex);
  return matches?.map((t) => t.slice(1)) ?? [];
}

export async function createHashtagMentions(
  hashtags: string[],
  userId: Id,
  itemId: Id
) {
  try {
    for await (const hashtag of hashtags) {
      await neo4jSession.executeWrite((tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (u:User)-[:CREATED]->(i:Item)

            WHERE ID(u) = $userId
              AND ID(i) = $itemId

            MERGE (t:Tag{ 
              title:      $hashtag,
              created_at: TIMESTAMP()
            })

            CREATE   (t)
                    -[:TAG_MENTIONS_BY]
                   ->(u)
                    -[:TAG_MENTIONS{ item_id: $itemId }]
                   ->(i)
                   
            RETURN t, u, i
          `,
          { hashtag, userId, itemId }
        );
      });
    }
  } catch (e) {
    console.error(e);
  }
}
