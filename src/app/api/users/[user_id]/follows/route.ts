import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

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

    const results = await neo4jSession.executeRead((tx) => {
      return tx.run(
        /* cypher */ `
          MATCH  (u:User)
                -[follows:FOLLOWS{ deleted: FALSE }]
                -(followed:User)
          
          WHERE id(u) = $userId

          RETURN u,
                 follows,
                 followed
        `,
        { userId }
      );
    });

    const nodes = getAllNodes(results);
    const links = getAllRelationships(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't get the user's items",
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

    const results = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (followed:User),
                  (follower:User)
                  
            WHERE id(followed) = $followedId
              AND id(follower) = $followerId

            CREATE   (follower)
                    -[f:FOLLOWS {
                         created_at: timestamp(),
                         deleted:    FALSE
                     }]
                   ->(followed)
                   
            RETURN followed, follower, f
          `,
          { followedId, followerId }
        );
      }
    );

    const nodes = getAllNodes(results);
    const links = getAllRelationships(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't post the follow", {
      status: 500,
    });
  }
}
