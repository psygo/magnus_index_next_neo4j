import { Id, NeoLinkLabel, NeoNodeLabel } from "./graph";

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

//----------------------------------------------------------

export interface OutLink<
  L extends NeoLinkLabel,
  S extends NeoNodeLabel,
  T extends NeoNodeLabel
> {
  type: L;
  source: Id | OutNode<S>;
  target: Id | OutNode<T>;
  properties: LinkProperties<L>;
}

export interface LinkProperties<L extends NeoLinkLabel> {}

export interface FollowsProperties
  extends LinkProperties<NeoLinkLabel.Follows> {
  created_at: number;
}
export interface FollowsLink
  extends OutLink<
    NeoLinkLabel.Follows,
    NeoNodeLabel.User,
    NeoNodeLabel.User
  > {}
