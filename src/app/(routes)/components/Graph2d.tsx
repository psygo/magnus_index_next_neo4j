import { useCallback, useMemo, useState } from "react";

import { Box, Button, Paper, Stack } from "@mui/material";

import ForceGraph2D, {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import { API_URL } from "../../lib/config/api_config";

import { LinkBase, NodeBase } from "../../lib/models/graph";

import { WhichHoverFloating } from "./Floating";

const NODE_R = 8;

type NodePos = {
  x: number;
  y: number;
};

type GraphProps = {
  data: GraphData<NodeBase, LinkBase>;
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
    new Set<NodeObject<NodeBase> | string | number>()
  );
  const [highlightLinks, setHighlightLinks] = useState(
    new Set<LinkObject>()
  );
  const [hoverNode, setHoverNode] =
    useState<NodeObject<NodeBase> | null>();

  const [hoverNodePos, setHoverNodePos] = useState<NodePos>(
    { x: 0, y: 0 }
  );

  function updateHighlight() {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  }

  const [lastClickedNode, setLastClickedNode] =
    useState<NodeObject<NodeBase> | null>();
  const [clickedNodes, setClickedNodes] = useState<
    [NodeObject<{}> | null, NodeObject<{}> | null]
  >([null, null]);

  function handleNodeClick(
    node: NodeObject<NodeBase> | null
  ) {
    setLastClickedNode(node);

    clickedNodes.push(node);
    const newClickedNodes = clickedNodes.slice(1) as [
      NodeObject<NodeBase> | null,
      NodeObject<NodeBase> | null
    ];
    setClickedNodes(newClickedNodes);
  }

  function handleNodeHover(
    node: NodeObject<NodeBase> | null
  ) {
    highlightNodes.clear();
    highlightLinks.clear();

    const canvas = document.body.querySelector("canvas")!;
    const updateHoverNodePos = (e: MouseEvent) => {
      setHoverNodePos({ x: e.clientX!, y: e.clientY! });
    };

    if (node) {
      document.body.style.cursor = "pointer";
      canvas.addEventListener(
        "mousemove",
        updateHoverNodePos
      );

      highlightNodes.add(node);
      node.neighbors.forEach(
        (neighbor: NodeObject<NodeBase>) =>
          highlightNodes.add(neighbor)
      );
      node.links.forEach((link: LinkObject) =>
        highlightLinks.add(link)
      );
    } else {
      document.body.style.cursor = "auto";
      canvas.removeEventListener(
        "mousemove",
        updateHoverNodePos
      );
    }

    setHoverNode(node || null);
    updateHighlight();
  }

  function handleLinkHover(
    link: LinkObject<NodeBase, LinkBase> | null
  ) {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source!);
      highlightNodes.add(link.target!);
    }

    updateHighlight();
  }

  const paintRing = useCallback(
    (
      node: NodeObject<NodeBase>,
      ctx: CanvasRenderingContext2D
    ) => {
      ctx.beginPath();
      ctx.arc(
        node.x!,
        node.y!,
        NODE_R * 1.4,
        0,
        2 * Math.PI,
        false
      );
      if (lastClickedNode)
        ctx.fillStyle = clickedNodes.includes(node)
          ? "black"
          : "transparent";
      else
        ctx.fillStyle =
          node === hoverNode ? "red" : "orange";
      ctx.fill();
    },
    [hoverNode, lastClickedNode, clickedNodes]
  );

  async function connectTwoItems() {
    const id1 = (clickedNodes[0]!.id as string)
      .split(":")
      .at(-1);
    const id2 = (clickedNodes[1]!.id as string)
      .split(":")
      .at(-1);

    const res = await fetch(
      `${API_URL}/items/${id1}/connections/${id2}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: "4",
        },
        body: JSON.stringify({
          title: "Test from Frontend",
        }),
      }
    );

    const json = await res.json();

    console.log(json);
  }

  return (
    <Box>
      <Stack
        sx={{
          position: "absolute",
          display: clickedNodes[1] ? "block" : "none",
          top: 10,
          right: 10,
          zIndex: 10,
          maxWidth: "300px",
          p: 2,
        }}
        spacing={2}
      >
        {clickedNodes[1] ? (
          <Paper>
            <WhichHoverFloating
              hoverNode={clickedNodes[1]}
            />
          </Paper>
        ) : null}
        {clickedNodes[0] ? (
          <Paper>
            <WhichHoverFloating
              hoverNode={clickedNodes[0]}
            />
          </Paper>
        ) : null}
        <Button onClick={connectTwoItems}>+</Button>
      </Stack>
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
          nodeCanvasObjectMode={(node) => {
            if (highlightNodes.has(node)) return "before";
            else if (lastClickedNode) return "after";
            else return "undefined";
          }}
          nodeCanvasObject={paintRing}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
          onNodeClick={handleNodeClick}
        />
      </Box>
    </Box>
  );
}
