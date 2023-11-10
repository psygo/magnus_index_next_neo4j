import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

export type UserParams = {
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

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH  (u:User)
          
          WHERE ID(u) = $userId

          RETURN u
        `,
        { userId }
      )
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse("Couldn't get the user", {
      status: 500,
    });
  }
}
