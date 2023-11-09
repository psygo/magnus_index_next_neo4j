import { NeoNodeLabel } from "./utils/node_labels";
import { NodeProperties, OutNode } from "./utils/nodes_models";
import { WithCreatedAt } from "./utils/mixin_models";

export type TagProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Tag> & {
    title: string;
  };
export type TagNode = OutNode<NeoNodeLabel.Tag> & {
  properties: TagProperties;
};
