import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
} from "./utils/exports";

export type UserProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.User> & {
    email: string;
    name: string;
  };
export type UserNode = OutNode<NeoNodeLabel.User> & {
  properties: UserProperties;
};
