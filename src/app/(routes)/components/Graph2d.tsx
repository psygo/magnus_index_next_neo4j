import _ from "lodash";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import ForceGraph2D, {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import {} from "@/lib/utils/array";

import { API_URL } from "@/lib/config/api_config";

import {
  NeoNodeLabel,
  OutLinkBase,
  OutNodeBase,
} from "@/lib/models/graph";

import {
  FloatingText,
  HoverBubble,
  NodePos,
} from "./Floating";

const NODE_R = 8;

export type NodeObj = NodeObject<OutNodeBase>;
export type LinkObj = LinkObject<OutNodeBase, OutLinkBase>;

export type NodeOrNull = NodeObj | null;
export type LinkOrNull = LinkObject<
  OutNodeBase,
  OutLinkBase
> | null;

export type ClickedNodesPair = [NodeOrNull, NodeOrNull];

type GraphProps = {
  data: GraphData<OutNodeBase, OutLinkBase>;
};

export function Graph2d({ data }: GraphProps) {
  const [gData, setGData] = useState(data);

  const dataMemo = useMemo(() => {
    const dataWithNeighbors = gData;

    dataWithNeighbors.links.forEach((link) => {
      const a = dataWithNeighbors.nodes
        .filter(
          (n) =>
            // @ts-ignore
            n.id === link.source || n.id === link.source!.id
        )
        .first();
      const b = dataWithNeighbors.nodes
        .filter(
          (n) =>
            // @ts-ignore
            n.id === link.target || n.id === link.source!.id
        )
        .first();

      if (a.neighbors === undefined) a.neighbors = [];
      if (b.neighbors === undefined) b.neighbors = [];
      a.neighbors.push(b);
      b.neighbors.push(a);

      if (a.links === undefined) a.links = [];
      if (b.links === undefined) b.links = [];
      a.links.push(link);
      b.links.push(link);
    });

    return dataWithNeighbors;
  }, [gData]);

  const [highlightNodes, setHighlightNodes] = useState(
    new Set<NodeObj | string | number>()
  );
  const [highlightLinks, setHighlightLinks] = useState(
    new Set<LinkObject>()
  );
  const [hoverNode, setHoverNode] = useState<NodeOrNull>();

  const [hoverNodePos, setHoverNodePos] = useState<NodePos>(
    { x: 0, y: 0 }
  );

  function updateHighlight() {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  }

  const [lastClickedNode, setLastClickedNode] =
    useState<NodeOrNull>();

  const [clickedNodes, setClickedNodes] =
    useState<ClickedNodesPair>([null, null]);

  function handleNodeClick(node: NodeOrNull) {
    setLastClickedNode(node);

    clickedNodes.push(node);
    const newClickedNodes = clickedNodes.slice(
      1
    ) as ClickedNodesPair;
    setClickedNodes(newClickedNodes);
  }

  function handleNodeHover(node: NodeOrNull) {
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
      node.neighbors.forEach((neighbor: NodeObj) =>
        highlightNodes.add(neighbor)
      );
      node.links.forEach((link: LinkObj) =>
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

  function handleLinkHover(link: LinkOrNull) {
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
    (node: NodeObj, ctx: CanvasRenderingContext2D) => {
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

  const handleConnectTwoItems = useCallback(async () => {
    const id1 = (clickedNodes.first()!.id as string)
      .split(":")
      .last();
    const id2 = (clickedNodes.second()!.id as string)
      .split(":")
      .last();

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

    const newData = await res.json();

    const mergedData = {
      nodes: _.unionBy(gData.nodes, newData.nodes, "id"),
      links: _.unionBy(gData.links, newData.links, "id"),
    };

    setGData(mergedData);
  }, [clickedNodes, gData, setGData]);

  const [connectionTitle, setConnectionTitle] =
    useState("");

  const fgRef = useRef();

  useEffect(() => {
    const fg = fgRef.current;
    if (fg)
      // @ts-ignore
      fg.d3Force("charge").strength(-100).distanceMax(1000);
  }, []);

  return (
    <Box>
      <form>
        <Stack
          sx={{
            position: "absolute",
            display: clickedNodes.second()
              ? "block"
              : "none",
            top: 10,
            right: 10,
            zIndex: 10,
            maxWidth: "300px",
            p: 2,
          }}
          spacing={2}
        >
          <TextField
            id="connection-title"
            type="text"
            label="Connection Title"
            variant="outlined"
            value={connectionTitle}
            onChange={(e) => {
              setConnectionTitle(e.target.value);
            }}
          />
          {clickedNodes.second() && (
            <Paper>
              <FloatingText
                hoverNode={clickedNodes.second()!}
              />
            </Paper>
          )}
          {clickedNodes.first() && (
            <Paper>
              <FloatingText
                hoverNode={clickedNodes.first()!}
              />
            </Paper>
          )}
          {clickedNodes.first() &&
            clickedNodes.second() && (
              <Button
                type="submit"
                onClick={async (e) => {
                  e.preventDefault();
                  await handleConnectTwoItems();
                }}
              >
                Connect
              </Button>
            )}
        </Stack>
      </form>
      {hoverNode && (
        <HoverBubble
          hoverNode={hoverNode}
          nodePos={hoverNodePos}
        />
      )}
      <Box sx={{ position: "absolute" }}>
        <ForceGraph2D
          ref={fgRef}
          graphData={dataMemo}
          nodeRelSize={NODE_R}
          nodeColor={(node) => {
            const n = node as NodeObject<OutNodeBase>;

            return n.type === NeoNodeLabel.User
              ? "purple"
              : n.type === NeoNodeLabel.Item
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
