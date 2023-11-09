import { NeoNodeLabel } from "./utils/node_labels";
import { NodeProperties, OutNode } from "./utils/nodes_models";
import { WithCreatedAt } from "./utils/mixin_models";

export type HyperlinkProperties = WithCreatedAt &
  NodeProperties<NeoNodeLabel.Hyperlink> & {
    link: string;
  };
export type HyperlinkNode =
  OutNode<NeoNodeLabel.Hyperlink> & {
    properties: HyperlinkProperties;
  };
