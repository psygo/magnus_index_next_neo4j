import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { getAllNodesAndRelationships } from "@/lib/utils/neo4j_utils";

/**
 * Get the item's comments
 */
export async function GET(
  _: NextRequest,
  { params }: PostCommentParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
            MATCH    (u:User)
                    -[cc:CREATED_COMMENT]
                   ->(c:Comment)
                    -[c_on:COMMENTS_ON]
                   ->(i:Item)

            WHERE ID(i) = $itemId
            
            RETURN u, cc, c, c_on, i
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
      "Couldn't get the item's comments",
      {
        status: 500,
      }
    );
  }
}

type PostCommentParams = {
  params: {
    item_id: string;
  };
};
/**
 * Post a comment
 */
export async function POST(
  req: NextRequest,
  { params }: PostCommentParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const userId = parseInt(req.headers.get("user_id")!);

    const { content } = await req.json();

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (u:User), (i:Item)

          WHERE ID(u) = $userId
            AND ID(i) = $itemId

          CREATE   (u)
                  -[cc:CREATED_COMMENT]
                 ->(c:Comment{ 
                     created_at: TIMESTAMP(),
                     deleted: FALSE,
                     content: $content
                   })
                  -[c_on:COMMENTS_ON]
                 ->(i)

          RETURN u, i, cc, c, c_on
        `,
        { itemId, userId, content }
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't create the comment", {
      status: 500,
    });
  }
}
