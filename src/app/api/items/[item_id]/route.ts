import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { getAllNodesAndRelationships } from "@/lib/utils/neo4j_utils";

export type GetItemParams = {
  params: {
    item_id: string;
  };
};
/**
 * Get Item
 */
export async function GET(
  _: NextRequest,
  { params }: GetItemParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
                  // Item and Author
          MATCH   (u:User)-[c:CREATED]->(i:Item),
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
          
          WHERE ID(i) = $itemId

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
