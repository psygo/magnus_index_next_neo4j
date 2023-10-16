import { NextRequest, NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

type GetItemParams = {
  params: {
    item_id: string;
  };
};

/**
 * Get Item
 */
export async function GET(
  _: NextRequest,
  { params }: GetItemParams
) {
  try {
    const itemId = parseInt(params.item_id);

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
      { status: 500 }
    );
  }
}
