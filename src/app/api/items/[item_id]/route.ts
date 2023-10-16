import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "../../../lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "../../../lib/utils/neo4j_utils";

/**
 * Item
 */
export async function GET(req: NextRequest) {
  try {
    const itemId = parseInt(
      req.nextUrl.href.split("/").at(-1)!
    );

    const itemsResults = await neo4jSession.executeRead(
      (tx) => {
        return tx.run(
          /* cypher */ `
            MATCH (i:Item)
            
            WHERE id(i) = $itemId

            RETURN i
          `,
          { itemId }
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
