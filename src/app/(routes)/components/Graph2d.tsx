import { useCallback, useMemo, useState } from "react";
import {
  GraphProps,
  NodeObject,
} from "../../lib/models/react_force_helpers";

import ForceGraph2D, {
  LinkObject,
} from "react-force-graph-2d";

const NODE_R = 8;

export function Graph2d({ data }: GraphProps) {
  const dataD = useMemo(() => {
    const gData = data;

    // cross-link node objects
    gData.links.forEach((link) => {
      const a = gData.nodes.filter(
        (n) => n.id === link.source
      )[0];
      const b = gData.nodes.filter(
        (n) => n.id === link.target
      )[0];
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });

    return gData;
  }, [data]);

  const [highlightNodes, setHighlightNodes] = useState(
    new Set()
  );
  const [highlightLinks, setHighlightLinks] = useState(
    new Set()
  );
  const [hoverNode, setHoverNode] = useState(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: NodeObject) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor: NodeObject) =>
        highlightNodes.add(neighbor)
      );
      node.links.forEach((link: LinkObject) =>
        highlightLinks.add(link)
      );
    }

    // @ts-ignore
    setHoverNode(node || null);
    updateHighlight();
  };

  const handleLinkHover = (link: LinkObject) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const paintRing = useCallback(
    (node: NodeObject, ctx: any) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(
        node.x,
        node.y,
        NODE_R * 1.4,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = node === hoverNode ? "red" : "orange";
      ctx.fill();
    },
    [hoverNode]
  );

  return (
    <ForceGraph2D
      graphData={dataD}
      nodeRelSize={NODE_R}
      autoPauseRedraw={false}
      linkWidth={(link) =>
        highlightLinks.has(link) ? 5 : 1
      }
      linkDirectionalParticles={4}
      linkDirectionalParticleWidth={(link) =>
        highlightLinks.has(link) ? 4 : 0
      }
      nodeCanvasObjectMode={(node) =>
        highlightNodes.has(node) ? "before" : undefined
      }
      nodeCanvasObject={paintRing}
      // @ts-ignore
      onNodeHover={handleNodeHover}
      // @ts-ignore
      onLinkHover={handleLinkHover}
    />
  );
}
