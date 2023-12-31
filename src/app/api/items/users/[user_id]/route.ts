import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import {
  GetUsersItemsReq,
  GetUsersItemsReqSchema,
} from "@models/exports";

import { getAllNodesAndRelationships } from "@utils/neo4j_utils";

type UserItemsParams = {
  params: GetUsersItemsReq;
};
/**
 * User's Items
 */
export async function GET(
  _: NextRequest,
  { params }: UserItemsParams
) {
  try {
    const { user_id: userId } =
      GetUsersItemsReqSchema.parse(params);

    const results = await neo4jSession.executeRead((tx) =>
      tx.run(
        /* cypher */ `
          MATCH  (u      :User{ ext_id: $userId })
                -[created:CREATED]->
                 (item   :Item)

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
