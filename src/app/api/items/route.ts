import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { getAllNodes } from "@/lib/utils/neo4j_utils";

/**
 * Create Item
 */
export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    const userId = parseInt(req.headers.get("user_id")!);

    const results = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (u:User)
            
            WHERE id(u) = $userId

            CREATE (u)-[:CREATED]->(
                i:Item{
                    created_at: timestamp(),
                    deleted:    FALSE,
                    title:      $title,
                    content:    $content
                }
            )
            
            RETURN i
          `,
          {
            userId,
            title,
            content,
          }
        );
      }
    );

    const createdItem = getAllNodes(results);

    return NextResponse.json({ nodes: createdItem });
  } catch (e) {
    console.error(e);

    return new NextResponse("Not able to create the item", {
      status: 500,
    });
  }
}
