import { NextResponse } from "next/server";

import { neo4jSession } from "@/lib/config/db";

import { getAllNodesAndRelationships } from "@/lib/utils/neo4j_utils";

/**
 * Get All Graph Nodes
 */
export async function GET() {
  try {
    const results = await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        MATCH (n)-[r]-(m)
        
        WHERE NOT (r:VOTES_ON) 
          AND NOT (n:Comment)
          AND NOT (m:Comment)
          
        RETURN n, r, m
      `)
    );

    return NextResponse.json(
      getAllNodesAndRelationships(results)
    );
  } catch (e) {
    console.error(e);

    return new NextResponse("Error retrieving graph", {
      status: 500,
    });
  }
}
