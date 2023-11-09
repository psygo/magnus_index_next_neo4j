import { Id, WithCreatedAt, WithId } from "./utils";
import { NeoNodeLabel } from "./node_labels";
import { NeoLinkLabel } from "./link_labels";
import {
  NodeProperties,
  OutNode,
  OutNodeAny,
} from "./nodes_models";
import { LinkProperties, OutLink } from "./link_models";

//----------------------------------------------------------
// Nodes

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
