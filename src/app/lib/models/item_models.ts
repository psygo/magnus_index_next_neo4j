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

export const CreateItemReqSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const GetUsersItemSchema = z.object({
  user_id: UserIdSchema,
});
export type GetUsersItem = z.infer<
  typeof GetUsersItemSchema
>;

//----------------------------------------------------------
