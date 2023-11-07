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
 * Post Item Votes
 */
export async function POST(
  req: NextRequest,
  { params }: PostVoteParams
) {
  try {
    const itemId = parseInt(params.item_id);

    const userId = parseInt(req.headers.get("user_id")!);

    const { points } = await req.json();

    const voteResults = await neo4jSession.executeWrite(
      (tx) =>
        tx.run(
          /* cypher */ `
            MATCH (voter:User), 
                  (creator:User)-[created:CREATED]->(item:Item)
            
            WHERE id(voter) = $userId
              AND id(item)  = $itemId

            CREATE   (voter)
                    -[vote:VOTES_ON{ points: $points }]
                   ->(item)

            WITH voter, vote, item, creator, created

            CALL apoc.do.when(
              $points > 0,
              'SET i.points_up   = i.points_up   + points RETURN i',
              'SET i.points_down = i.points_down + points RETURN i',
              { i: item, points: $points }
            )
            YIELD value AS _value1

            CALL apoc.do.when(
              $points > 0,
              'SET c.points_up   = c.points_up   + points RETURN c',
              'SET c.points_down = c.points_down + points RETURN c',
              { c: creator, points: $points }
            )
            YIELD value AS _value2

            SET item.points    = item.points    + $points
            SET creator.points = creator.points + $points

            RETURN voter, vote, item, creator, created
          `,
          { itemId, userId, points }
        )
    );

    const nodes = getAllNodes(voteResults);
    const links = getAllRelationships(voteResults);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't create a vote on this item",
      { status: 500 }
    );
  }
}
