import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

import {
  PostConnectionReqBodySchema,
  PostConnectionReqParams,
  PostConnectionReqParamsSchema,
  UserIdSchema,
} from "@models/exports";

type PostConnectionParams = {
  params: PostConnectionReqParams;
};
/**
 * Connect Item
 */
export async function POST(
  req: NextRequest,
  { params }: PostConnectionParams
) {
  try {
    const { item_id: itemId, connectee_id: connecteeId } =
      PostConnectionReqParamsSchema.parse(params);

    const userId = UserIdSchema.parse(
      req.headers.get("user_id")
    );

    const { title } = PostConnectionReqBodySchema.parse(
      await req.json()
    );

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
