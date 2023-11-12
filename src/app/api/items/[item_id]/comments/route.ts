import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

import {
  CreateCommentReqSchema,
  GetCommentReqSchema,
  GetItemReqSchema,
  UserIdSchema,
} from "@models/exports";

import { GetItemParams } from "../route";

/**
 * Get the item's comments
 */
export async function GET(
  _: NextRequest,
  { params }: PostCommentParams
) {
  try {
    const { item_id: itemId } =
      GetCommentReqSchema.parse(params);

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

type PostCommentParams = GetItemParams;
/**
 * Post a comment
 */
export async function POST(
  req: NextRequest,
  { params }: PostCommentParams
) {
  try {
    const { item_id: itemId } =
      GetItemReqSchema.parse(params);

    const userId = UserIdSchema.parse(
      req.headers.get("user_id")
    );

    const { content } = CreateCommentReqSchema.parse(
      await req.json()
    );

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
