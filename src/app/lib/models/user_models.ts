import { z } from "zod";

import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
  WithPoints,
} from "./utils/exports";

export type UserProperties = WithPoints &
  WithCreatedAt &
  NodeProperties<NeoNodeLabel.User> & {
    email: string;
    name: string;
  };
export type UserNode = OutNode<NeoNodeLabel.User> & {
  properties: UserProperties;
};

//----------------------------------------------------------
// API

// 1. User ID
export const UserIdSchema = z
  .number()
  .int()
  .positive()
  .or(z.string());

// 2. Create User
export const PostUserReqBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

// 3. Get User
export const GetUserReqParamsSchema = z.object({
  user_id: UserIdSchema,
});
export type GetUserReqParams = z.infer<
  typeof GetUserReqParamsSchema
>;

// 4. Create Follow
export const PostFollowReqParamsSchema =
  GetUserReqParamsSchema;

// 5. Get Follow
export const GetFollowReqParamsSchema =
  PostFollowReqParamsSchema;

//----------------------------------------------------------
