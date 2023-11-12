import { z } from "zod";

import { GetItemReqSchema } from "./item_models";

//----------------------------------------------------------
// API

// 1. Create Connection
export const PostConnectionReqParamsSchema =
  GetItemReqSchema.merge(
    z.object({ connectee_id: z.string() })
  );
export type PostConnectionReqParams = z.infer<
  typeof PostConnectionReqParamsSchema
>;

export const PostConnectionReqBodySchema = z.object({
  title: z.string(),
});

//----------------------------------------------------------
