import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "../../../lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "../../../lib/utils/neo4j_utils";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.href.split("/").at(-1);

    const itemsResults = await neo4jSession.executeRead(
      (tx) => {
        return tx.run(
          /* cypher */ `
                MATCH  (u      :User)
                      -[created:CREATED]->
                       (item   :Item)
                
                WHERE id(u) = 3

                RETURN u, created, item
              `,
          { userId }
        );
      }
    );

    const nodes = getAllNodes(itemsResults);
    const links = getAllRelationships(itemsResults);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Couldn't get the user's items",
      { status: 204 }
    );
  }
}
