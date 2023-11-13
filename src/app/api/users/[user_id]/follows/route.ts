import { nanoid } from "nanoid";

import { NextRequest, NextResponse } from "next/server";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@utils/neo4j_utils";

import {
  FollowsLink,
  PostFollowReqParamsSchema,
  UserIdSchema,
  UserNode,
} from "@models/exports";

import { UserParams } from "../route";

export type FollowsParams = UserParams;
/**
 * Get User Follows
 */
export async function GET(
  _: NextRequest,
  { params }: FollowsParams
) {
  try {
    const { user_id: userId } =
      PostFollowReqParamsSchema.parse(params);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH  (u       :User{ ext_id: $userId })
                -[follows :FOLLOWS{ deleted: FALSE }]
                -(followed:User)

          RETURN u, follows, followed
        `,
        { userId }
      )
    );

    const nodes = getAllNodes<UserNode>(results);
    const links = getAllRelationships<FollowsLink>(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't get the user's follows",
      { status: 500 }
    );
  }
}

/**
 * Post Follow
 */
export async function POST(
  req: NextRequest,
  { params }: FollowsParams
) {
  try {
    const followerId = UserIdSchema.parse(
      req.headers.get("user_id")
    );

    const { user_id: followedId } =
      PostFollowReqParamsSchema.parse(params);

    const extId = nanoid(NANOID_SIZE);

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (followed:User{ ext_id: $followedId }),
                (follower:User{ ext_id: $followerId })
                
          CREATE   (follower)
                  -[f:FOLLOWS {
                     created_at: TIMESTAMP(),
                     deleted:    FALSE,
                     ext_id:     $extId
                   }]
                 ->(followed)
                 
          RETURN followed, follower, f
        `,
        { followedId, followerId, extId }
      )
    );

    const nodes = getAllNodes<UserNode>(results);
    const links = getAllRelationships<FollowsLink>(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't post the follow", {
      status: 500,
    });
  }
}
