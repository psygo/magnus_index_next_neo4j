import { z } from "zod";

import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
  WithPoints,
} from "./utils/exports";

import { UserIdSchema } from "./user_models";

export type ItemProperties = WithPoints &
  WithCreatedAt &
  NodeProperties<NeoNodeLabel.Item> & {
    title: string;
    content: string;
  };
export type ItemNode = OutNode<NeoNodeLabel.Item> & {
  properties: ItemProperties;
};

//----------------------------------------------------------
// API

export const ItemIdSchema = UserIdSchema;

// 1. Create Item
export const CreateItemReqSchema = z.object({
  title: z.string(),
  content: z.string(),
});

// 2. Get Item
export const GetItemReqSchema = z.object({
  item_id: ItemIdSchema,
});
export type GetItemReq = z.infer<typeof GetItemReqSchema>

// 3. Get User's Items
export const GetUsersItemsReqSchema = z.object({
  user_id: UserIdSchema,
});
export type GetUsersItemsReq = z.infer<
  typeof GetUsersItemsReqSchema
>;

//----------------------------------------------------------
