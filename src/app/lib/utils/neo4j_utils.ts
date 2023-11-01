import _ from "lodash";

import {
  Node,
  Path,
  QueryResult,
  RecordShape,
  Relationship,
} from "neo4j-driver";

import {
  LinkProperties,
  Neo4jGraphElement,
  NeoLinkLabel,
  NeoNodeBase,
  NeoNodeLabel,
  OutLinkBase,
  OutNodeBase,
  stringToNeoLinkLabel,
} from "@/lib/models/graph";
import { GraphData } from "react-force-graph-2d";

export function extractNeo4jId(s: string) {
  return s.split(":").last();
}

export function flattenRecords(
  results: QueryResult<RecordShape>
) {
  return results.records
    .map((record) => record.keys.map((k) => record.get(k)))
    .flat(2) as Neo4jGraphElement[];
}

export function getAllNodes(
  results: QueryResult<RecordShape>
) {
  const flattenedRecords = flattenRecords(results);

  const allNodes = flattenedRecords.filter(
    (fr) => fr instanceof Node
  ) as NeoNodeBase[];

  const remappedNodes = allNodes.map<OutNodeBase>((n) => ({
    type: n.labels.first(),
    id: extractNeo4jId(n.elementId),
    properties: n.properties,
  }));

  const nodesSet = _.uniqBy(remappedNodes, "id");

  return nodesSet;
}

export function getAllRelationships(
  results: QueryResult<RecordShape>
) {
  const flattenedRecords = flattenRecords(results);

  const allRelationshipsAndPaths = flattenedRecords.filter(
    (fr) => fr instanceof Relationship || fr instanceof Path
  ) as (Relationship | Path)[];

  const allRelationships = allRelationshipsAndPaths.map(
    (rp) => {
      if (rp instanceof Relationship) {
        return rp;
      } else {
        return rp.segments.first().relationship;
      }
    }
  );

  const remappedRelationships =
    allRelationships.map<OutLinkBase>((r) => ({
      type: stringToNeoLinkLabel(r.type),
      id: extractNeo4jId(r.elementId),
      source: extractNeo4jId(r.startNodeElementId),
      target: extractNeo4jId(r.endNodeElementId),
      properties: r.properties as LinkProperties,
    }));

  const relationshipsSet = _.uniqBy(
    remappedRelationships,
    "id"
  );

  return relationshipsSet;
}

export function collapseConnectionsPaths(
  data: GraphData<OutNodeBase, OutLinkBase>
) {
  // 1. Get Connection Origins
  const connectionOrigins = data.links.filter(
    (l) => l.type === NeoLinkLabel.ConnectionOrigin
  );

  // 2. Collapse Connection Paths
  const collapsedConnections: OutLinkBase[] = [];
  for (const connectionOrigin of connectionOrigins) {
    const destinationLink = data.links
      .filter((l) => l.source === connectionOrigin.target)
      .first();
    const connectionOriginTarget = data.nodes
      .filter((n) => n.id === connectionOrigin.target)
      .first();

    const collapsedConnection = {
      type: NeoLinkLabel.Connection,
      id: connectionOrigin.target,
      source: connectionOrigin.source,
      target: destinationLink.target,
      properties: connectionOriginTarget.properties,
    } as OutLinkBase;

    collapsedConnections.push(collapsedConnection);
  }

  // 3. Links wihtout the intermediate Connection Links
  const linksWithoutConnectionOriginOrDestinationOrConnectedBy =
    data.links.filter(
      (l) =>
        l.type !== NeoLinkLabel.ConnectionOrigin &&
        l.type !== NeoLinkLabel.ConnectionDestination &&
        l.type !== NeoLinkLabel.ConnectedBy
    );

  // 4. Merging Links
  const mergedLinks =
    linksWithoutConnectionOriginOrDestinationOrConnectedBy.concat(
      collapsedConnections
    );

  // 5. Nodes without the Connection Nodes
  const nodesWithoutConnections = data.nodes.filter(
    (n) => n.type !== NeoNodeLabel.Connection
  );

  return {
    nodes: nodesWithoutConnections,
    links: mergedLinks,
  } as GraphData<OutNodeBase, OutLinkBase>;
}
