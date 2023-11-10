import { NodeObject } from "react-force-graph-2d";

import {
  ItemProperties,
  NeoNodeLabel,
} from "@models/exports";

import { ItemFloatingPage } from "@components/Items/exports";

export type FloatingPageProps = {
  clickedNode: NodeObject;
};

export function FloatingPage({
  clickedNode,
}: FloatingPageProps) {
  if (clickedNode.type === NeoNodeLabel.Item) {
    const itemProperties =
      clickedNode.properties as ItemProperties;
    return (
      <ItemFloatingPage
        itemId={clickedNode.id!}
        initialItemProperties={itemProperties}
      />
    );
  } else {
    return <></>;
  }
}
