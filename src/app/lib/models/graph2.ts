import {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import { Id } from "./graph";
import { NeoNodeLabel } from "./node_labels";
import { NeoLinkLabel } from "./link_labels";

//----------------------------------------------------------
// API

export type ApiStandardRes = GraphData<
  OutNodeAny,
  OutLinkAny
>;

//----------------------------------------------------------
// React Force Graph

export type NodeObj = NodeObject<OutNodeAny>;
export type LinkObj = LinkObject<OutNodeAny, OutLinkAny>;

export type NodeOrNull = NodeObj | null;
export type LinkOrNull = LinkObj | null;

export type ClickedNodesPair = [NodeOrNull, NodeOrNull];

export type GraphProps = {
  data: ApiStandardRes;
};

//----------------------------------------------------------
// Aux

export type WithId = {
  id: Id;
};

export type WithPoints = {
  points: number;
  points_up: number;
  points_down: number;
};

export type WithCreatedAt = {
  created_at: number;
};

//----------------------------------------------------------
// Nodes

export type OutNodeAny = WithId & {
  type: NeoNodeLabel;
  properties: NodePropertiesAny;
};
export type OutNode<N extends NeoNodeLabel> = OutNodeAny & {
  type: N;
  properties: NodeProperties<N>;
};

export type NodePropertiesAny = {};
export type NodeProperties<N extends NeoNodeLabel> =
  NodePropertiesAny;

export type UserProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.User> & {
    email: string;
    name: string;
  };
export type UserNode = OutNode<NeoNodeLabel.User> & {
  properties: UserProperties;
};

export type ItemProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Item> & {
    title: string;
    content: string;
  };
export type ItemNode = OutNode<NeoNodeLabel.Item> & {
  properties: ItemProperties;
};

export type CommentProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Comment> & {
    content: string;
  };
export type CommentNode = OutNode<NeoNodeLabel.Comment> & {
  properties: CommentNode;
};

export type TagProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Tag> & {
    title: string;
  };
export type TagNode = OutNode<NeoNodeLabel.Tag> & {
  properties: TagProperties;
};

export type HyperlinkProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Hyperlink> & {
    link: string;
  };
export type HyperlinkNode =
  OutNode<NeoNodeLabel.Hyperlink> & {
    properties: HyperlinkProperties;
  };

//----------------------------------------------------------
// Links

export type OutLinkAny = WithId & {
  type: NeoLinkLabel;
  source: Id | OutNodeAny;
  target: Id | OutNodeAny;
  properties: LinkPropertiesAny;
};
export type OutLink<
  L extends NeoLinkLabel,
  S extends NeoNodeLabel,
  T extends NeoNodeLabel
> = OutLinkAny & {
  type: L;
  source: Id | OutNode<S>;
  target: Id | OutNode<T>;
  properties: LinkProperties<L>;
};

export type LinkPropertiesAny = {};
export type LinkProperties<L extends NeoLinkLabel> =
  LinkPropertiesAny;

export type FollowsProperties = WithCreatedAt &
  LinkProperties<NeoLinkLabel.Follows> & {
    created_at: number;
  };
export type FollowsLink = OutLink<
  NeoLinkLabel.Follows,
  NeoNodeLabel.User,
  NeoNodeLabel.User
> & { properties: FollowsProperties };

//----------------------------------------------------------
