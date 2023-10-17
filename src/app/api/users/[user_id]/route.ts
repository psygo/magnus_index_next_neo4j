import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

type UserParams = {
  params: {
    user_id: string;
  };
};

/**
 * Get User
 */
export async function GET(
  _: NextRequest,
  { params }: UserParams
) {
  try {
    const userId = parseInt(params.user_id);

    const results = await neo4jSession.executeRead((tx) => {
      return tx.run(
        /* cypher */ `
            MATCH  (u:User)
            
            WHERE id(u) = $userId

            RETURN u
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
      { status: 204 }
    );
  }
}
