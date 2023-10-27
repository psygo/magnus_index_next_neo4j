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
    const results = await neo4jSession.executeRead((tx) => {
      return tx.run(/* cypher */ `
        MATCH (n)-[r]-(m)
        RETURN n, r, m

        // MATCH   (n1:Item)
        //        -[:CONNECTION_ORIGIN]
        //       ->(r:Connection)
        //        -[:CONNECTION_DESTINATION]
        //       ->(n2:Item),
        //       (r)-[:CONNECTED_BY]-(u:User)

        // WITH u, 
        //      n1, 
        //      n2,
        //      apoc.create.vRelationship(
        //        n1, 
        //        "CONNECTION", 
        //        apoc.map.merge(
        //          properties(r), 
        //          { connected_by: u.id }
        //        ), 
        //        n2
        //      ) AS rel

        // RETURN u,
        //        n1,
        //        n2,
        //        apoc.path.create(n1, [rel]) AS CONNECTION
      `);
    });
    
    // console.log(results.records)

    const nodes = getAllNodes(results);
    const links = getAllRelationships(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse("Error retrieving graph");
  }
}
