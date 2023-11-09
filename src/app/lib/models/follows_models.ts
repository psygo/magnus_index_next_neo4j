import { NeoLinkLabel } from "./link_labels";
import { LinkProperties, OutLink } from "./link_models";
import { NeoNodeLabel } from "./node_labels";
import { WithCreatedAt } from "./utils";

export type FollowsProperties = WithCreatedAt &
  LinkProperties<NeoLinkLabel.Follows> & {
    created_at: number;
  };
export type FollowsLink = OutLink<
  NeoLinkLabel.Follows,
  NeoNodeLabel.User,
  NeoNodeLabel.User
> & { properties: FollowsProperties };
