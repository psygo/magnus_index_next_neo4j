import {
  LinkProperties,
  NeoLinkLabel,
  NeoNodeLabel,
  OutLink,
  WithCreatedAt,
} from "./utils/exports";

export type FollowsProperties = WithCreatedAt &
  LinkProperties<NeoLinkLabel.Follows> & {
    created_at: number;
  };
export type FollowsLink = OutLink<
  NeoLinkLabel.Follows,
  NeoNodeLabel.User,
  NeoNodeLabel.User
> & { properties: FollowsProperties };
