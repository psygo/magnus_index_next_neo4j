import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

import { GetItemParams } from "../route";

type GetItemVotesParams = GetItemParams;
/**
 * Get Item Votes
 */
export async function GET(
  _: NextRequest,
  { params }: GetItemVotesParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const itemsResults = await neo4jSession.executeRead(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (u:User)-[v:VOTES_ON]->(i:Item)
            
            WHERE id(i) = $itemId

            RETURN u, v, i
          `,
          { itemId }
        );
      }
    );

    const nodes = getAllNodes(itemsResults);
    const links = getAllRelationships(itemsResults);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't get the item's votes",
      { status: 500 }
    );
  }
}

type PostVoteParams = GetItemVotesParams;

/**
 * Get Item Votes
 */
export async function POST(
  req: NextRequest,
  { params }: PostVoteParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const userId = parseInt(req.headers.get("user_id")!);

    const itemsResults = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (u:User), (i:Item)

            WHERE id(u) = $userId
              AND id(i) = $itemId

            CREATE   (u)
                    -[v:VOTES_ON{
                         created_at: timestamp(),
                         deleted:    FALSE
                     }]
                   ->(i)
                   
            RETURN u, v, i
          `,
          { itemId, userId }
        );
      }
    );

    const nodes = getAllNodes(itemsResults);
    const links = getAllRelationships(itemsResults);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't create a vote on this item",
      { status: 500 }
    );
  }
}
