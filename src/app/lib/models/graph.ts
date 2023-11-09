import {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

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
  TagMentions = "TAG_MENTIONS",
  TagMentionsBy = "TAG_MENTIONS_BY",
  HyperlinkMentions = "HYPERLINK_MENTIONS",
  HyperlinkMentionsBy = "HYPERLINK_MENTIONS_BY",
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
// React Force Graph

export type NodeObj = NodeObject<OutNodeBase>;
export type LinkObj = LinkObject<OutNodeBase, OutLinkBase>;

export type NodeOrNull = NodeObj | null;
export type LinkOrNull = LinkObject<
  OutNodeBase,
  OutLinkBase
> | null;

export type ClickedNodesPair = [NodeOrNull, NodeOrNull];

export type GraphProps = {
  data: GraphData<OutNodeBase, OutLinkBase>;
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
export type OutNode =
  | UserNode
  | ItemNode
  | ConnectionNode
  | TagNode
  | HyperlinkNode;

export type UserProperties = PointsProperties & {
  email: string;
  name: string;
};
export type UserNode = OutNodeBase & {
  type: NeoNodeLabel.User;
  properties: UserProperties;
};

export type ItemProperties = PointsProperties & {
  title: string;
  content: string;
};
export type ItemNode = OutNodeBase & {
  type: NeoNodeLabel.User;
  properties: UserProperties;
};

export type ConnectionProperties = PointsProperties & {
  title: string;
};
export type ConnectionNode = OutNodeBase & {
  type: NeoNodeLabel.Connection;
  properties: ConnectionProperties;
};

export type CommentProperties = PointsProperties & {
  content: string;
};
export type CommentNode = OutNodeBase & {
  type: NeoNodeLabel.Comment;
  properties: CommentProperties;
};

export type TagProperties = {
  title: string;
};
export type TagNode = OutNodeBase & {
  type: NeoNodeLabel.Tag;
  properties: TagProperties;
};

export type HyperlinkProperties = {
  link: string;
};
export type HyperlinkNode = OutNodeBase & {
  type: NeoNodeLabel.Hyperlink;
  properties: HyperlinkProperties;
};

//----------------------------------------------------------
// Link Properties

export type LinkProperties = FollowsProperties;
export type OutLink = FollowsLink;

export type FollowsProperties = {
  created_at: number;
};
export type FollowsLink = OutLinkBase & {
  type: NeoLinkLabel.Follows;
  source: Id | UserNode;
  target: Id | UserNode;
  properties: FollowsProperties;
};

//----------------------------------------------------------
