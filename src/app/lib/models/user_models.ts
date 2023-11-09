import { NeoNodeLabel } from "./node_labels";
import { NodeProperties, OutNode } from "./nodes_models";
import { WithCreatedAt } from "./utils";

export type UserProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.User> & {
    email: string;
    name: string;
  };
export type UserNode = OutNode<NeoNodeLabel.User> & {
  properties: UserProperties;
};
