import { NeoNodeLabel } from "./node_labels";
import { NodeProperties, OutNode } from "./nodes_models";
import { WithCreatedAt } from "./utils";

export type HyperlinkProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Hyperlink> & {
    link: string;
  };
export type HyperlinkNode =
  OutNode<NeoNodeLabel.Hyperlink> & {
    properties: HyperlinkProperties;
  };
