import { NeoNodeLabel } from "./graph";

export interface OutNode<N extends NeoNodeLabel> {
  type: N;
  properties: NodeProperties<N>;
}

export interface NodeProperties<N extends NeoNodeLabel> {}

export interface UserProperties
  extends NodeProperties<NeoNodeLabel.User> {
  email: string;
  name: string;
}
export interface UserNode {
  type: NeoNodeLabel.User;
  properties: UserProperties;
}
