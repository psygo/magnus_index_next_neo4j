import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

import {
  GetItemVotesReqParamsSchema,
  PostItemVoteReqBodySchema,
  PostItemVoteReqParamsSchema,
  UserIdSchema,
} from "@models/exports";

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
    const { item_id: itemId } =
      GetItemVotesReqParamsSchema.parse(params);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (u:User)-[v:VOTES_ON]->(i:Item)
          
          WHERE ID(i) = $itemId

          RETURN u, v, i
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
      "Couldn't get the item's votes",
      { status: 500 }
    );
  }
}

type PostItemVoteParams = GetItemVotesParams;
/**
 * Post Item Votes
 */
export async function POST(
  req: NextRequest,
  { params }: PostItemVoteParams
) {
  try {
    const { item_id: itemId } =
      PostItemVoteReqParamsSchema.parse(params);

    const userId = UserIdSchema.parse(
      req.headers.get("user_id")
    );

    const { points } = PostItemVoteReqBodySchema.parse(
      await req.json()
    );

    const results = await neo4jSession.executeWrite((tx) =>
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

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't create a vote on this item",
      { status: 500 }
    );
  }
}
