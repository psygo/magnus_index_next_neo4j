import { useCallback, useMemo, useState } from "react";

import { Box, Paper, Typography } from "@mui/material";

import ForceGraph2D, {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import {
  Connection,
  Item,
  NodeBase,
  User,
} from "../../lib/models/graph";
import {
  ConnectionFloatingText,
  ItemFloatingText,
  UserFloatingText,
  WhichHoverFloating,
} from "./Floating";

const NODE_R = 8;

type GraphProps = {
  data: GraphData;
};

export function Graph2d({ data }: GraphProps) {
  const dataMemo = useMemo(() => {
    const dataWithNeighbors = data;

    dataWithNeighbors.links.forEach((link) => {
      const a = dataWithNeighbors.nodes.filter(
        (n) => n.id === link.source
      )[0];
      const b = dataWithNeighbors.nodes.filter(
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

    return dataWithNeighbors;
  }, [data]);

  const [highlightNodes, setHighlightNodes] = useState(
    new Set()
  );
  const [highlightLinks, setHighlightLinks] = useState(
    new Set<LinkObject>()
  );
  const [hoverNode, setHoverNode] =
    useState<NodeObject<{}> | null>();

  const [hoverNodePos, setHoverNodePos] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  function updateHighlight() {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  }

  function handleNodeHover(node: NodeObject | null) {
    highlightNodes.clear();
    highlightLinks.clear();

    const canvas = document.body.querySelector("canvas")!;
    const updateHoverNodePos = (e: MouseEvent) => {
      setHoverNodePos({ x: e.clientX!, y: e.clientY! });
    };

    if (node) {
      document.body.style.cursor = "pointer"
      canvas.addEventListener(
        "mousemove",
        updateHoverNodePos
      );

      highlightNodes.add(node);
      node.neighbors.forEach((neighbor: NodeObject) =>
        highlightNodes.add(neighbor)
      );
      node.links.forEach((link: LinkObject) =>
        highlightLinks.add(link)
      );
    } else {
      document.body.style.cursor = "auto"
      canvas.removeEventListener(
        "mousemove",
        updateHoverNodePos
      );
    }

    setHoverNode(node || null);
    updateHighlight();
  }

  function handleLinkHover(link: LinkObject | null) {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  }

  const paintRing = useCallback(
    (node: NodeObject, ctx: any) => {
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
    <Box>
      {hoverNode ? (
        <Paper
          sx={{
            position: "absolute",
            display: hoverNode ? "block" : "none",
            top: hoverNodePos!.y - 60,
            left: hoverNodePos!.x + 15,
            zIndex: 10,
            maxWidth: "300px",
            p: 2,
          }}
        >
          <WhichHoverFloating hoverNode={hoverNode} />
        </Paper>
      ) : null}
      <Box sx={{ position: "absolute" }}>
        <ForceGraph2D
          graphData={dataMemo}
          nodeRelSize={NODE_R}
          nodeColor={(node) => {
            const n = node as NodeObject<NodeBase>;

            return n.labels.includes("User")
              ? "purple"
              : n.labels.includes("Item")
              ? "green"
              : "blue";
          }}
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
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
        />
      </Box>
    </Box>
  );
}
