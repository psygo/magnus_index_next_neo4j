import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
  WithPoints,
} from "./utils/exports";

export type ItemProperties = WithPoints & WithCreatedAt &
  NodeProperties<NeoNodeLabel.Item> & {
    title: string;
    content: string;
  };
export type ItemNode = OutNode<NeoNodeLabel.Item> & {
  properties: ItemProperties;
};
