import { z } from "zod";

import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
} from "./utils/exports";

import { GetItemReqSchema } from "./item_models";

export type CommentProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Comment> & {
    content: string;
  };
export type CommentNode = OutNode<NeoNodeLabel.Comment> & {
  properties: CommentNode;
};

//----------------------------------------------------------
// API

// 1. Create Comment
export const CreateCommentReqSchema = z.object({
  content: z.string(),
});

// 2. Get Comment
export const GetCommentReqSchema = GetItemReqSchema;
