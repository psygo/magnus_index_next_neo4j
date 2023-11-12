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
  .or(z.string())
  .transform(Number);

//----------------------------------------------------------
