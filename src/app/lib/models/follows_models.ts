import { NeoLinkLabel } from "./utils/link_labels";
import { LinkProperties, OutLink } from "./utils/link_models";
import { NeoNodeLabel } from "./utils/node_labels";
import { WithCreatedAt } from "./utils/mixin_models";

export type FollowsProperties = WithCreatedAt &
  LinkProperties<NeoLinkLabel.Follows> & {
    created_at: number;
  };
export type FollowsLink = OutLink<
  NeoLinkLabel.Follows,
  NeoNodeLabel.User,
  NeoNodeLabel.User
> & { properties: FollowsProperties };
