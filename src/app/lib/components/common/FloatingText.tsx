import { NodeObject } from "react-force-graph-2d";

import {
  HyperlinkProperties,
  ItemProperties,
  NeoNodeLabel,
  TagProperties,
  UserProperties,
} from "@models/exports";

import { ItemFloatingText } from "@components/Items/exports";
import { UserFloatingText } from "@components/Users/exports";
import { TagFloatingText } from "@components/Tags/exports";
import { HyperlinkFloatingText } from "@components/Hyperlinks/exports";

export type FloatingTextProps = {
  hoverNode: NodeObject;
};

export function FloatingText({
  hoverNode,
}: FloatingTextProps) {
  if (hoverNode.type === NeoNodeLabel.User) {
    const userProperties =
      hoverNode.properties as UserProperties;
    return (
      <UserFloatingText userProperties={userProperties} />
    );
  } else if (hoverNode.type === NeoNodeLabel.Item) {
    const itemProperties =
      hoverNode.properties as ItemProperties;
    return (
      <ItemFloatingText itemProperties={itemProperties} />
    );
  } else if (hoverNode.type === NeoNodeLabel.Tag) {
    const tagProperties =
      hoverNode.properties as TagProperties;
    return (
      <TagFloatingText tagProperties={tagProperties} />
    );
  } else if (hoverNode.type === NeoNodeLabel.Hyperlink) {
    const hyperlinkProperties =
      hoverNode.properties as HyperlinkProperties;
    return (
      <HyperlinkFloatingText
        hyperlinkProperties={hyperlinkProperties}
      />
    );
  } else {
    return <></>;
  }
}
