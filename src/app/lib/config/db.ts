import * as neo4j from "neo4j-driver";

function neo4jSetup() {
  const neo4jPort = parseInt(process.env.NEO4J_PORT!);
  const uri = `neo4j://localhost:${neo4jPort}`;

  const remoteUriPrefix = "neo4j+s://";
  const remoteUri = `${remoteUriPrefix}2a8bc089.databases.neo4j.io:7687`;

  const user = process.env.NEO4J_USER!;
  const password = process.env.NEO4J_PASSWORD!;

  const remoteUser = process.env.AURA_USERNAME!;
  const remotePassword = process.env.AURA_PASSWORD!;
  
  console.log(remoteUser)
  console.log(remotePassword)

  const driver = neo4j.driver(
    remoteUri,
    neo4j.auth.basic(remoteUser, remotePassword)
  );
  const session = driver.session();

  return session;
}

export const neo4jSession = neo4jSetup();
