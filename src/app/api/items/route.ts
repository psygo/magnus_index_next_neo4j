import { NextResponse } from "next/server";

import { neo4jSession } from "../../lib/db";

export async function POST() {
  try {
    await neo4jSession.executeWrite((tx) => {
      return tx.run(/* cypher */ `
        CREATE (dumbo:Person:Actor{name: 'Dumbo'});
      `);
    });
    
    return NextResponse.json({ data: "created" });
  } catch (e) {
    console.error(e);

    return new NextResponse("Not able to create item", {
      status: 500,
    });
  }
}
