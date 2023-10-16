import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "../../lib/config/db";
import { getAllNodes } from "../../lib/utils/neo4j_utils";

export async function POST(req: NextRequest) {
  try {
    const {
      user_id: userId,
      title,
      content,
    } = await req.json();

    const results = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(
          /* cypher */ `
          MATCH  (u:User)
          
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

    return NextResponse.json({ created_item: createdItem });
  } catch (e) {
    console.error(e);

    return new NextResponse("Not able to create the item", {
      status: 500,
    });
  }
}
