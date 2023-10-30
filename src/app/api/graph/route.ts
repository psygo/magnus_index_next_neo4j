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
        // 1. All nodes and links, except Connections,
        //    Items, and Votes
        MATCH (n)-[r]-(m)
        
        WHERE NOT ((n:Connection) AND (n:Item))
          AND NOT ((m:Connection) AND (m:Item))
          AND NOT (r:VOTES_ON)
          
        // 2. Aggreggating Votes
        MATCH (:User)-[v:VOTES_ON]->(ic)

        WHERE ic:Item OR ic:Connection

        WITH ic, SUM(v.points) AS TOTAL_POINTS, n, r, m
        
        SET ic.points = TOTAL_POINTS

        RETURN ic, n, r, m
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
