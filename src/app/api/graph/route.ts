import { NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import {
  getAllNodes,
  getAllRelationships,
} from "@/lib/utils/neo4j_utils";

/**
 * Get All Graph Nodes
 */
export async function GET() {
  try {
    const results = await neo4jSession.executeWrite(
      (tx) => {
        return tx.run(/* cypher */ `
          MATCH (n)-[r]-(m)
          
          WHERE NOT (r:VOTES_ON)
            
          RETURN n, r, m
        `);
      }
    );

    const nodes = getAllNodes(results);
    const links = getAllRelationships(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse("Error retrieving graph");
  }
}
