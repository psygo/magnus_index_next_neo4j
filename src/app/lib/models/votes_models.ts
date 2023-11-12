import { z } from "zod";

import { PointsSchema } from "./utils/exports";

import { GetItemReqSchema } from "./item_models";

//----------------------------------------------------------
// API

// 1. Create Vote
export const PostItemVoteReqParamsSchema = GetItemReqSchema;
export type PostItemvoteReqParams = z.infer<
  typeof PostItemVoteReqParamsSchema
>;

export const PostItemVoteReqBodySchema = z.object({
  points: PointsSchema,
});

// 2. Get Item Votes
export const GetItemVotesReqParamsSchema =
  PostItemVoteReqParamsSchema;

//----------------------------------------------------------
