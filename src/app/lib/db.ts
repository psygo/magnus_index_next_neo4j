import * as neo4j from "neo4j-driver";

function neo4jSetup() {
  const neo4jPort = parseInt(process.env.NEO4J_PORT!);
  const uri = `neo4j://localhost:${neo4jPort}`;
  const user = process.env.NEO4J_USER!;
  const password = process.env.NEO4J_PASSWORD!;

  const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(user, password)
  );
  const session = driver.session();

  return session;
}

export const neo4jSession = neo4jSetup();
