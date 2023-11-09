import {
  NeoNodeLabel,
  NodeProperties,
  OutNode,
  WithCreatedAt,
} from "./utils/exports";

export type ItemProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Item> & {
    title: string;
    content: string;
  };
export type ItemNode = OutNode<NeoNodeLabel.Item> & {
  properties: ItemProperties;
};
