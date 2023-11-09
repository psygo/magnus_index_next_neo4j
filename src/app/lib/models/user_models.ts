import { NeoNodeLabel } from "./utils/node_labels";
import { NodeProperties, OutNode } from "./utils/nodes_models";
import { WithCreatedAt } from "./utils/mixin_models";

export type UserProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.User> & {
    email: string;
    name: string;
  };
export type UserNode = OutNode<NeoNodeLabel.User> & {
  properties: UserProperties;
};
