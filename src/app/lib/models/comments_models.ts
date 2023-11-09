import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
} from "./utils/exports";

export type CommentProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Comment> & {
    content: string;
  };
export type CommentNode = OutNode<NeoNodeLabel.Comment> & {
  properties: CommentNode;
};
