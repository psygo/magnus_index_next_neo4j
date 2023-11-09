import { NeoNodeLabel } from "./node_labels";
import { NodeProperties, OutNode } from "./nodes_models";
import { WithCreatedAt } from "./utils";

export type ItemProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Item> & {
    title: string;
    content: string;
  };
export type ItemNode = OutNode<NeoNodeLabel.Item> & {
  properties: ItemProperties;
};
