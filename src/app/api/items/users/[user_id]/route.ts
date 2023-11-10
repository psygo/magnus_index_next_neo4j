import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

type UserItemsParams = {
  params: {
    user_id: string;
  };
};
/**
 * User's Items
 */
export async function GET(
  _: NextRequest,
  { params }: UserItemsParams
) {
  try {
    const userId = parseInt(params.user_id);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH  (u      :User)
                -[created:CREATED]->
                 (item   :Item)
          
          WHERE ID(u) = $userId

          RETURN u, created, item
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
      "Couldn't get the user's items",
      { status: 204 }
    );
  }
}
