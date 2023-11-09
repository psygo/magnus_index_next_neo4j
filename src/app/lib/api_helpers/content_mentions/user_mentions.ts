import { neo4jSession } from "@/lib/config/db";

import { Id } from "@/lib/models/utils/mixin_models";

const userMentionsRegex = /\B@\w+/g;
export function extractUserMentions(text: string) {
  const matches = text.match(userMentionsRegex);
  return matches?.map((t) => t.slice(1)) ?? [];
}

export async function createUserMentions(
  content: string,
  itemId: Id
) {
  try {
    const userMentions = extractUserMentions(content);

    if (userMentions.length > 0) {
      for await (const userMention of userMentions) {
        await neo4jSession.executeWrite((tx) =>
          tx.run(
            /* cypher */ `
              MATCH (i:Item), (u:User{ name: $userMention })

              WHERE ID(i) = $itemId

              CREATE (i)-[:USER_MENTIONS]->(u)
            `,
            { userMention, itemId }
          )
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}
