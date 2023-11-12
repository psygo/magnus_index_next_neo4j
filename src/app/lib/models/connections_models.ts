import { z } from "zod";

import {
  GetItemReqSchema,
  ItemIdSchema,
} from "./item_models";

//----------------------------------------------------------
// API

// 1. Create Connection
export const PostConnectionReqParamsSchema =
  GetItemReqSchema.merge(
    z.object({ connectee_id: ItemIdSchema })
  );
export type PostConnectionReqParams = z.infer<
  typeof PostConnectionReqParamsSchema
>;

export const PostConnectionReqBodySchema = z.object({
  title: z.string(),
});

//----------------------------------------------------------
