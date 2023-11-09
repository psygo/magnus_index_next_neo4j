import {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import { Id, NeoLinkLabel, NeoNodeLabel } from "./graph";

//----------------------------------------------------------
// API

export type ApiStandardRes = GraphData<
  OutNodeAny,
  OutLinkAny
>;

//----------------------------------------------------------
// React Force Graph

export type NodeObj = NodeObject<OutNodeAny>;
export type LinkObj = LinkObject<OutLinkAny>;

export type NodeOrNull = NodeObj | null;
export type LinkOrNull = LinkObject<
  OutNodeAny,
  OutLinkAny
> | null;

export type ClickedNodesPair = [NodeOrNull, NodeOrNull];

export type GraphProps = {
  data: ApiStandardRes;
};

//----------------------------------------------------------
// Aux

export interface WithId {
  id: Id;
}

//----------------------------------------------------------
// Nodes

export interface OutNodeAny extends WithId {
  type: NeoNodeLabel;
  properties: NodePropertiesAny;
}
export interface OutNode<N extends NeoNodeLabel>
  extends OutNodeAny {
  type: N;
  properties: NodeProperties<N>;
}

export interface NodePropertiesAny {}
export interface NodeProperties<N extends NeoNodeLabel>
  extends NodePropertiesAny {}

export interface UserProperties
  extends NodeProperties<NeoNodeLabel.User> {
  email: string;
  name: string;
}
export interface UserNode
  extends OutNode<NeoNodeLabel.User> {
  properties: UserProperties;
}

export interface ItemProperties
  extends NodeProperties<NeoNodeLabel.Item> {
  title: string;
  content: string;
}
export interface ItemNode
  extends OutNode<NeoNodeLabel.Item> {
  properties: ItemProperties;
}

export interface CommentProperties
  extends NodeProperties<NeoNodeLabel.Comment> {
  content: string;
}
export interface CommentNode
  extends OutNode<NeoNodeLabel.Comment> {
  properties: CommentNode;
}

export interface TagProperties
  extends NodeProperties<NeoNodeLabel.Tag> {
  title: string;
}
export interface TagNode extends OutNode<NeoNodeLabel.Tag> {
  properties: TagProperties;
}

export interface HyperlinkProperties
  extends NodeProperties<NeoNodeLabel.Hyperlink> {
  link: string;
}
export interface HyperlinkNode
  extends OutNode<NeoNodeLabel.Hyperlink> {
  properties: HyperlinkProperties;
}

//----------------------------------------------------------
// Links

export interface OutLinkAny extends WithId {
  type: NeoLinkLabel;
  source: Id | OutNodeAny;
  target: Id | OutNodeAny;
  properties: LinkPropertiesAny;
}
export interface OutLink<
  L extends NeoLinkLabel,
  S extends NeoNodeLabel,
  T extends NeoNodeLabel
> extends OutLinkAny {
  type: L;
  source: Id | OutNode<S>;
  target: Id | OutNode<T>;
  properties: LinkProperties<L>;
}

export interface LinkPropertiesAny {}
export interface LinkProperties<L extends NeoLinkLabel>
  extends LinkPropertiesAny {}

export interface FollowsProperties
  extends LinkProperties<NeoLinkLabel.Follows> {
  created_at: number;
}
export interface FollowsLink
  extends OutLink<
    NeoLinkLabel.Follows,
    NeoNodeLabel.User,
    NeoNodeLabel.User
  > {}

//----------------------------------------------------------
