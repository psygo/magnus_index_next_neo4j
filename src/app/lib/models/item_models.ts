import { NeoNodeLabel } from "./utils/node_labels";
import { NodeProperties, OutNode } from "./utils/nodes_models";
import { WithCreatedAt } from "./utils/mixin_models";

export type ItemProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Item> & {
    title: string;
    content: string;
  };
export type ItemNode = OutNode<NeoNodeLabel.Item> & {
  properties: ItemProperties;
};
