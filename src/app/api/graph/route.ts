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
        // 1. All things except paths we're going to collapse.
        MATCH (n)-[rell]-(m)

        WHERE NOT (n:Connection)
          AND NOT (m:Connection)

        // 2. Collapsing Connections
        MATCH   (n1:Item)
               -[:CONNECTION_ORIGIN]
              ->(r:Connection)
               -[:CONNECTION_DESTINATION]
              ->(n2:Item),
              (r)-[:CONNECTED_BY]-(u:User)

        WITH n, rell, m,
             u, n1, n2,
             // 3. Aggregating collapsed data
             apoc.create.vRelationship(
               n1, 
               "CONNECTION", 
               apoc.map.merge(
                 properties(r), 
                 { connected_by: u.id }
               ), 
               n2
             ) AS rel

        RETURN n, rell, m,
               u, n1, n2,
               apoc.path.create(n1, [rel]) AS CONNECTION
      `);
    });

    const nodes = getAllNodes(results);
    const links = getAllRelationships(results);

    return NextResponse.json({ nodes, links });
  } catch (e) {
    console.error(e);

    return new NextResponse("Error retrieving graph");
  }
}
