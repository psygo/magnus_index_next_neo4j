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
  NeoNodeBase,
  OutLinkBase,
  OutNodeBase,
  stringToNeoLinkLabel,
} from "@/lib/models/graph";

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
