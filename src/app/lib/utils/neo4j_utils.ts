import _ from "lodash";

import {
  Node,
  QueryResult,
  RecordShape,
  Relationship,
} from "neo4j-driver";

import {
  Neo4jGraphElement,
  NeoLinkBase,
  NeoNodeBase,
  OutLinkBase,
  OutNodeBase,
} from "../models/graph";

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
    id: n.elementId,
    properties: n.properties,
  }));

  const nodesSet = _.uniqBy(remappedNodes, "id");

  return nodesSet;
}

export function getAllRelationships(
  results: QueryResult<RecordShape>
) {
  const flattenedRecords = flattenRecords(results);

  const allRelationships = flattenedRecords.filter(
    (fr) => fr instanceof Relationship
  ) as NeoLinkBase[];

  const remappedRelationships =
    allRelationships.map<OutLinkBase>((r) => ({
      type: r.type,
      id: r.elementId,
      source: r.startNodeElementId,
      target: r.endNodeElementId,
      properties: r.properties,
    }));

  const relationshipsSet = _.uniqBy(
    remappedRelationships,
    "id"
  );

  return relationshipsSet;
}
