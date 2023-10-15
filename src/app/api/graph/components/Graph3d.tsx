import { useState } from "react";

import * as THREE from "three";

import ForceGraph3D, {
  NodeObject,
} from "react-force-graph-3d";

import { GraphProps } from "../../../lib/models/react_force_helpers";

export function Graph3d({ data }: GraphProps) {
  const [highlightNodes, setHighlightNodes] = useState(
    new Set()
  );
  const [hoverNode, setHoverNode] =
    useState<NodeObject | null>(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
  };

  const handleNodeHover = (node: any) => {
    highlightNodes.clear();

    if (node) {
      highlightNodes.add(node);
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  return (
    <ForceGraph3D
      graphData={data}
      nodeColor={(n) => {
        if (hoverNode)
          return n.id === hoverNode.id ? "orange" : "green";
        else return "green";
      }}
      // nodeAutoColorBy={(node) => node.labels[0]}
      onNodeHover={handleNodeHover}
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.25}
      nodeThreeObject={({ id }) =>
        new THREE.Mesh(
          new THREE.SphereGeometry(10),
          new THREE.MeshLambertMaterial({
            color: Math.round(
              Math.random() * Math.pow(2, 24)
            ),
            transparent: true,
            opacity: 0.75,
          })
        )
      }
      nodeThreeObjectExtend={true}
    />
  );
}
