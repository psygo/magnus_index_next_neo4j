import {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import { NeoNodeLabel } from "./node_labels";
import { NeoLinkLabel } from "./link_labels";

//----------------------------------------------------------
// Aux

export type Id = string | number;

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
