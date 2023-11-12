import _ from "lodash";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Box } from "@mui/material";

import ForceGraph2D, {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import {} from "@utils/array";
import { collapseConnectionsPaths } from "@utils/neo4j_utils";

import { API_URL } from "@config/api_config";

import {
  ClickedNodesPair,
  GraphProps,
  LinkObj,
  LinkOrNull,
  NeoNodeLabel,
  NodeObj,
  NodeOrNull,
  OutNodeAny,
} from "@models/exports";

import {
  HoverBubble,
  PageBubble,
} from "@components/common/exports";
import { CreateConnection } from "@components/Connections/exports";
import { NodePos } from "@components/utils";

const NODE_R = 8;

export function Graph2d({ data }: GraphProps) {
  const [gData, setGData] = useState(data);

  const dataMemo = useMemo(() => {
    const dataWithNeighbors =
      collapseConnectionsPaths(gData);

    dataWithNeighbors.links.forEach((link) => {
      const a = dataWithNeighbors.nodes
        .filter(
          (n) =>
            n.id === link.source ||
            n.id === (link.source as OutNodeAny).id
        )
        .first();
      const b = dataWithNeighbors.nodes
        .filter(
          (n) =>
            n.id === link.target ||
            n.id === (link.source as OutNodeAny).id
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
    const id1 = clickedNodes.first()!.id;
    const id2 = clickedNodes.second()!.id;

    const body = {
      title: "Test from Frontend",
    };

    const res = await fetch(
      `${API_URL}/items/${id1}/connections/${id2}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: "7",
        },
        body: JSON.stringify(body),
      }
    );

    const newData = await res.json();

    const mergedData = {
      nodes: _.unionBy(gData.nodes, newData.nodes, "id"),
      links: _.unionBy(gData.links, newData.links, "id"),
    };

    setGData(mergedData);
  }, [clickedNodes, gData, setGData]);

  const fgRef =
    useRef<ForceGraphMethods<NodeObj, LinkObj>>();

  useEffect(() => {
    const fg = fgRef.current;
    if (fg)
      fg.d3Force("charge")!
        .strength(-100)
        .distanceMax(1000);
  }, []);

  return (
    <Box>
      <CreateConnection
        clickedNodes={clickedNodes}
        connectTwoItems={handleConnectTwoItems}
      />
      {hoverNode && (
        <HoverBubble
          hoverNode={hoverNode}
          nodePos={hoverNodePos}
        />
      )}
      {clickedNodes[1] && (
        <PageBubble clickedNode={clickedNodes[1]} />
      )}
      <Box sx={{ position: "absolute" }}>
        <ForceGraph2D
          ref={fgRef}
          graphData={dataMemo}
          nodeRelSize={NODE_R}
          nodeColor={(node) => {
            const n = node as NodeObject<OutNodeAny>;

            if (n.type === NeoNodeLabel.User) {
              return "purple";
            } else if (n.type === NeoNodeLabel.Item) {
              return "green";
            } else if (n.type === NeoNodeLabel.Tag) {
              return "darkcyan";
            } else if (n.type === NeoNodeLabel.Hyperlink) {
              return "cornflowerblue";
            } else {
              return "grey";
            }
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
            else return undefined;
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
