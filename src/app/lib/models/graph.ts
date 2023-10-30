//----------------------------------------------------------
// Aux

export type Id = string;

export enum NeoNodeLabel {
  User = "User",
  Item = "Item",
  Connection = "Connection",
}

export function stringToNeoNodeLabel(
  s: string
): NeoNodeLabel {
  return Object.values(NeoNodeLabel).find(
    (nodeLabel) => nodeLabel === s
  )!;
}

export enum NeoLinkLabel {
  Follow = "FOLLOWS",
  VotesOn = "VOTES_ON",
  ConnectedBy = "CONNECTED_BY",
  ConnectionOrigin = "CONNECTION_ORIGIN",
  ConnectionDestination = "CONNECTION_DESTINATION",
}

export function stringToNeoLinkLabel(
  s: string
): NeoLinkLabel {
  return Object.values(NeoLinkLabel).find(
    (linkLabel) => linkLabel === s
  )!;
}

export type Neo4jGraphElement = {
  elementId: string;
  [key: string]: any;
};

//----------------------------------------------------------
// From Neo4j

export type NeoNodeBase = {
  labels: NeoNodeLabel[];
  elementId: Id;
  properties: NodeProperties;
};

export type NeoLinkBase = {
  type: NeoLinkLabel;
  elementId: Id;
  startNodeElementId: Id;
  endNodeElementId: Id;
  properties: LinkProperties;
};

//----------------------------------------------------------
// From the API

export type OutNodeBase = {
  type: NeoNodeLabel;
  id: Id;
  properties: NodeProperties;
};

export type OutLinkBase = {
  type: NeoLinkLabel;
  id: Id;
  source: Id;
  target: Id;
  properties: LinkProperties;
};

//----------------------------------------------------------
// Node Properties

export type NodeProperties =
  | UserProperties
  | ItemProperties
  | ConnectionProperties;

export type UserProperties = {
  email: string;
  name: string;
};

export type ItemProperties = {
  title: string;
  content: string;
};

export type ConnectionProperties = {
  title: string;
};

//----------------------------------------------------------
// Link Properties

export type LinkProperties =
  | FollowsProperties
  | ConnectionLinkProperties;

export type FollowsProperties = {
  created_at: number;
};

export type ConnectionLinkProperties = {
  title: string;
  connected_by: string;
};

//----------------------------------------------------------
