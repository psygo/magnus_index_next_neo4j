import { NeoNodeLabel } from "./node_labels";
import { NodeProperties, OutNode } from "./nodes_models";
import { WithCreatedAt } from "./utils";

export type CommentProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Comment> & {
    content: string;
  };
export type CommentNode = OutNode<NeoNodeLabel.Comment> & {
  properties: CommentNode;
};
