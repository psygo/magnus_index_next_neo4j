import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

import {
  GetUserReqParams,
  GetUserReqParamsSchema,
} from "@models/exports";

export type UserParams = {
  params: GetUserReqParams;
};
/**
 * Get User
 */
export async function GET(
  _: NextRequest,
  { params }: UserParams
) {
  try {
    const { user_id: userId } =
      GetUserReqParamsSchema.parse(params);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH (u:User{ ext_id: $userId })

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
