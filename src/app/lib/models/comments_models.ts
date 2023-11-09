import { NeoNodeLabel } from "./utils/node_labels";
import { NodeProperties, OutNode } from "./utils/nodes_models";
import { WithCreatedAt } from "./utils/mixin_models";

export type CommentProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Comment> & {
    content: string;
  };
export type CommentNode = OutNode<NeoNodeLabel.Comment> & {
  properties: CommentNode;
};
