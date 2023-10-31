import { NextRequest, NextResponse } from "next/server";
import {
  getAllNodes,
  getAllRelationships,
} from "../../../../lib/utils/neo4j_utils";
import { neo4jSession } from "../../../../lib/config/db";

export async function GET(
  _: NextRequest,
  { params }: PostCommentParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const commentsResults = await neo4jSession.executeRead(
      (tx) => {
        return tx.run(
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
        );
      }
    );

    console.log(commentsResults.records);

    const nodes = getAllNodes(commentsResults);
    const links = getAllRelationships(commentsResults);

    return NextResponse.json({ nodes, links });
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

    const commentResults = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (u:User), (i:Item)

            WHERE ID(u) = $userId
              AND ID(i) = $itemId

            CREATE   (u)
                    -[cc:CREATED_COMMENT]
                   ->(c:Comment{ 
                       created_at: timestamp(),
                       deleted: FALSE,
                       content: $content
                     })
                    -[c_on:COMMENTS_ON]
                   ->(i)

            RETURN u, i, cc, c, c_on
          `,
          { itemId, userId, content }
        );
      }
    );

    const nodes = getAllNodes(commentResults);
    const links = getAllRelationships(commentResults);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't create the comment", {
      status: 500,
    });
  }
}
