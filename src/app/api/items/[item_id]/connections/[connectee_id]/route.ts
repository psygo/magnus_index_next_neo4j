import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { getAllNodesAndRelationships } from "@/lib/utils/neo4j_utils";

type PostItemParams = {
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
  { params }: PostItemParams
) {
  try {
    const itemId = parseInt(params.item_id);
    const connecteeId = parseInt(params.connectee_id);

    const userId = parseInt(req.headers.get("user_id")!);

    const { title } = await req.json();

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (u:User), (i:Item), (connectee:Item)

          WHERE ID(u)         = $userId
            AND ID(i)         = $itemId
            AND ID(connectee) = $connecteeId
          
          CREATE   (i)
                  -[connected:CONNECTION_ORIGIN]
                 ->(c:Connection{
                      created_at:  TIMESTAMP(),
                      deleted:     FALSE,
                      title:       $title,
                      points_up:   0,
                      points_down: 0,
                      points:      0
                   })
                  -[connected_to:CONNECTION_DESTINATION]
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
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't create a new item connection",
      { status: 500 }
    );
  }
}
