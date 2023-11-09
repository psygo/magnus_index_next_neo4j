import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
} from "./utils/exports";

export type TagProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Tag> & {
    title: string;
  };
export type TagNode = OutNode<NeoNodeLabel.Tag> & {
  properties: TagProperties;
};
