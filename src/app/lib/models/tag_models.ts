import { NeoNodeLabel } from "./node_labels";
import { NodeProperties, OutNode } from "./nodes_models";
import { WithCreatedAt } from "./utils";

export type TagProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Tag> & {
    title: string;
  };
export type TagNode = OutNode<NeoNodeLabel.Tag> & {
  properties: TagProperties;
};
