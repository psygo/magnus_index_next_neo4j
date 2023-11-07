//----------------------------------------------------------
// Aux

export type Id = string | number;

export enum NeoNodeLabel {
  User = "User",
  Item = "Item",
  Connection = "Connection",
  Comment = "Comment",
  Tag = "Tag",
  Hyperlink = "Hyperlink",
}

export function stringToNeoNodeLabel(
  s: string
): NeoNodeLabel {
  return Object.values(NeoNodeLabel).find(
    (nodeLabel) => nodeLabel === s
  )!;
}

export enum NeoLinkLabel {
  Follows = "FOLLOWS",
  VotesOn = "VOTES_ON",
  ConnectedBy = "CONNECTED_BY",
  ConnectionOrigin = "CONNECTION_ORIGIN",
  ConnectionDestination = "CONNECTION_DESTINATION",
  Connection = "CONNECTION",
  Created = "CREATED",
  CreatedComment = "CREATED_COMMENT",
  CommentsOn = "COMMENTS_ON",
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
  source: Id | OutNodeBase;
  target: Id | OutNodeBase;
  properties: LinkProperties;
};

//----------------------------------------------------------
// Aux Properties

export type PointsProperties = {
  points: number;
  points_up: number;
  points_down: number;
};

//----------------------------------------------------------
// Node Properties

export type NodeProperties =
  | UserProperties
  | ItemProperties
  | ConnectionProperties
  | TagProperties
  | HyperlinkProperties;

export type UserProperties = PointsProperties & {
  email: string;
  name: string;
};

export type ItemProperties = PointsProperties & {
  title: string;
  content: string;
};

export type ConnectionProperties = PointsProperties & {
  title: string;
};

export type TagProperties = {
  title: string;
};

export type HyperlinkProperties = {
  link: string;
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
