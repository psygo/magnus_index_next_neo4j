import { nanoid } from "nanoid";

import { NextRequest, NextResponse } from "next/server";

import { NANOID_SIZE, neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

import { PostUserReqBodySchema } from "@models/user_models";

/**
 * Get Users
 */
export async function GET() {
  try {
    const results = await neo4jSession.executeRead((tx) =>
      tx.run(/* cypher */ `
        MATCH (u:User)

        RETURN u
      `)
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't get the users", {
      status: 500,
    });
  }
}

/**
 * Create User
 */
export async function POST(req: NextRequest) {
  const { name, email } = PostUserReqBodySchema.parse(
    await req.json()
  );

  const extId = nanoid(NANOID_SIZE);

  try {
    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          CREATE (u:User{
            created_at:  TIMESTAMP(),
            deleted:     FALSE,
            is_admin:    FALSE,
            ext_id:      $extId,
            name:        $name,
            email:       $email,
            points_up:   0,
            points_down: 0,
            points:      0
          })
          
          RETURN u
        `,
        { extId, name, email }
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't create the user", {
      status: 500,
    });
  }
}
