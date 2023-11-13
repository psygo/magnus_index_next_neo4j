import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

import {
  GetItemReq,
  GetItemReqSchema,
} from "@models/exports";

export type GetItemParams = {
  params: GetItemReq;
};
/**
 * Get Item
 */
export async function GET(
  _: NextRequest,
  { params }: GetItemParams
) {
  try {
    const { item_id: itemId } =
      GetItemReqSchema.parse(params);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
                  // Item and Author
          MATCH   (u:User)
                 -[c:CREATED]
                ->(i:Item{ ext_id: $itemId }),
                  // Tags
                  (t:Tag)
                 -[tmb:TAG_MENTIONS_BY]
                ->(u)
                 -[tm:TAG_MENTIONS]
                ->(i),
                  // Hyperlinks
                  (h:Hyperlink)
                 -[hmb:HYPERLINK_MENTIONS_BY]
                ->(u)
                 -[hm:HYPERLINK_MENTIONS]
                ->(i),
                  // Comments
                  (commenter:User)
                 -[cc:CREATED_COMMENT]
                ->(comment:Comment)
                 -[co:COMMENTS_ON]
                ->(i),
                  // Connections
                  (other_item:Item)
                 -[or_dest1]
                 -(conn:Connection)
                 -[or_dest2]
                 -(i),
                  (conn)
                 -[cby:CONNECTED_BY]
                ->(conn_author:User)

          RETURN u, c, i,
                 t, tm, tmb,
                 h, hm, hmb,
                 commenter, comment, cc, co,
                 other_item, or_dest1, or_dest2, conn, cby, conn_author
        `,
        { itemId }
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't get the requested item",
      { status: 500 }
    );
  }
}
