import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

type GetItemParams = {
  params: {
    item_id: string;
    connectee_id: string;
  };
};

/**
 * Connect Item
 */
export async function POST(
  req: NextRequest,
  { params }: GetItemParams
) {
  try {
    const itemId = parseInt(params.item_id);
    const connecteeId = parseInt(params.connectee_id);

    const userId = parseInt(req.headers.get("user_id")!);

    const { title } = await req.json();

    const itemsResults = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (u:User), (i:Item), (connectee:Item)

            WHERE id(u)         = $userId
              AND id(i)         = $itemId
              AND id(connectee) = $connecteeId
            
            CREATE   (i)
                    -[connected:CONNECTED]
                   ->(c:Connection{
                        created_at: timestamp(),
                        deleted:    FALSE,
                        title:      $title
                     })
                    -[connected_to:CONNECTED_TO]
                   ->(connectee),
                     (c)
                    -[c_by:CONNECTED_BY]
                   ->(u)
                   
            RETURN u,
                   i,
                   connectee,
                   connected,
                   c,
                   connected_to,
                   c_by
          `,
          { userId, itemId, connecteeId, title }
        );
      }
    );

    const nodes = getAllNodes(itemsResults);
    const links = getAllRelationships(itemsResults);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't get the user's items",
      { status: 500 }
    );
  }
}
