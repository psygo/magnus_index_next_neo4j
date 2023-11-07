import { neo4jSession } from "@/lib/config/db";

import { Id } from "@/lib/models/graph";

const urlRegex =
  /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
export function extractHyperlinks(text: string) {
  const matches = text.match(urlRegex);
  return (matches as string[]) ?? [];
}

export async function createHyperlinkMentions(
  content: string,
  userId: Id,
  itemId: Id
) {
  try {
    const hyperlinks = extractHyperlinks(content);

    if (hyperlinks.length > 0) {
      for await (const hyperlink of hyperlinks) {
        await neo4jSession.executeWrite((tx) => {
          return tx.run(
            /* cypher */ `
              MATCH (u:User)-[:CREATED]->(i:Item)

              WHERE ID(u) = $userId
                AND ID(i) = $itemId

              MERGE (h:Hyperlink{ link: $hyperlink })

              SET h.created_at = TIMESTAMP()

              CREATE   (h)
                      -[:HYPERLINK_MENTIONS_BY]
                     ->(u)
                      -[:HYPERLINK_MENTIONS{ item_id: $itemId }]
                     ->(i)
                     
              RETURN h, u, i
            `,
            { hyperlink, userId, itemId }
          );
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
}
