import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

/**
 * Get Users
 */
export async function GET() {
  try {
    const results = await neo4jSession.executeRead((tx) => {
      return tx.run(/* cypher */ `
        MATCH (u:User)

        RETURN u
      `);
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
 * Create User
 */
export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  try {
    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(
        /* cypher */ `
          CREATE (u:User{
            created_at:  TIMESTAMP(),
            deleted:     FALSE,
            is_admin:    FALSE,
            name:        $name,
            email:       $email,
            points_up:   0,
            points_down: 0,
            points:      0
          })
          
          RETURN u
        `,
        { name, email }
      )
    );

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
