import _ from "lodash";

import {
  Node,
  QueryResult,
  RecordShape,
  Relationship,
} from "neo4j-driver";

type Neo4jGraphElement = { elementId: string };

type NodeBase = Neo4jGraphElement & { id: string };

type RelationshipBase = Neo4jGraphElement & {
  startNodeElementId: string;
  endNodeElementId: string;
};

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
  ) as NodeBase[];
  const remappedNodes = allNodes.map((n) => ({
    ...n,
    id: n.elementId,
  }));
  const nodesSet = _.uniqBy(remappedNodes, "id");
  return nodesSet as NodeBase[];
}

export function getAllRelationships(
  results: QueryResult<RecordShape>
) {
  const flattenedRecords = flattenRecords(results);
  const allRelationships = flattenedRecords.filter(
    (fr) => fr instanceof Relationship
  ) as RelationshipBase[];
  const remappedRelationships = allRelationships.map(
    (r) => ({
      ...r,
      id: r.elementId,
      source: r.startNodeElementId,
      target: r.endNodeElementId,
    })
  );
  const relationshipsSet = _.uniqBy(
    remappedRelationships,
    "id"
  );
  return relationshipsSet as RelationshipBase[];
}
