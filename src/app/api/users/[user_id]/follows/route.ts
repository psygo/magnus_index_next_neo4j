import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { getAllNodesAndRelationships } from "@/lib/utils/neo4j_utils";

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
    const userId = parseInt(params.user_id);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH  (u:User)
                -[follows:FOLLOWS{ deleted: FALSE }]
                -(followed:User)
          
          WHERE ID(u) = $userId

          RETURN u,
                 follows,
                 followed
        `,
        { userId }
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
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
    const followerId = parseInt(
      req.headers.get("user_id")!
    );
    const followedId = parseInt(params.user_id);

    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (followed:User),
                (follower:User)
                
          WHERE ID(followed) = $followedId
            AND ID(follower) = $followerId

          CREATE   (follower)
                  -[f:FOLLOWS {
                       created_at: TIMESTAMP(),
                       deleted:    FALSE
                   }]
                 ->(followed)
                 
          RETURN followed, follower, f
        `,
        { followedId, followerId }
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't post the follow", {
      status: 500,
    });
  }
}
