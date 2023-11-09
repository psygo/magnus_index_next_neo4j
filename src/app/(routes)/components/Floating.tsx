import {
  Box,
  Chip,
  Icon,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ModeStandbyIcon from "@mui/icons-material/ModeStandby";
import LinkIcon from "@mui/icons-material/Link";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TagIcon from "@mui/icons-material/Tag";
import DescriptionIcon from "@mui/icons-material/Description";

import { NodeObject } from "react-force-graph-2d";

import {
  ConnectionProperties,
  HyperlinkProperties,
  ItemProperties,
  NeoNodeLabel,
  PointsProperties,
  TagProperties,
  UserProperties,
} from "@/lib/models/graph";
import {
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { ItemFloatingPage } from "../../lib/components/Items/ItemFloatingPage";

type FloatingTextProps = {
  hoverNode: NodeObject;
};

export type NodePos = {
  x: number;
  y: number;
};

type HoverBubbleProps = FloatingTextProps & {
  nodePos: NodePos;
};

export function HoverBubble({
  hoverNode,
  nodePos,
}: HoverBubbleProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "absolute",
        display: hoverNode ? "block" : "none",
        top: nodePos.y - 60,
        left: nodePos.x + 15,
        zIndex: 10,
        maxWidth: "300px",
        p: 1.5,
      }}
    >
      <FloatingText hoverNode={hoverNode} />
    </Paper>
  );
}

type FloatingPageProps = {
  clickedNode: NodeObject;
};
export function PageBubble({
  clickedNode,
}: FloatingPageProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        position: "absolute",
        display: clickedNode ? "block" : "none",
        top: 10,
        left: 10,
        zIndex: 10,
        maxWidth: "275px",
        p: 1.5,
      }}
    >
      <FloatingPage clickedNode={clickedNode} />
    </Paper>
  );
}

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

export function PointsStats({
  pointsProperties,
}: {
  pointsProperties: PointsProperties;
}) {
  return (
    <Stack direction="row" spacing={1}>
      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ModeStandbyIcon />
        </Icon>
        <Typography fontWeight="bold">
          {pointsProperties.points}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ArrowUpward sx={{ color: "green" }} />
        </Icon>
        <Typography color="green">
          {pointsProperties.points_up}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={0.5}>
        <Icon>
          <ArrowDownward sx={{ color: "red" }} />
        </Icon>
        <Typography color="red">
          {pointsProperties.points_down}
        </Typography>
      </Stack>
    </Stack>
  );
}

export function UserFloatingText({
  userProperties,
}: {
  userProperties: UserProperties;
}) {
  return (
    <Stack spacing={1}>
      <Chip
        icon={<AccountCircleIcon />}
        color="primary"
        label="User"
        size="small"
        sx={{
          p: "5px",
          maxWidth: "max-content",
          backgroundColor: "purple",
          "& .MuiChip-label": {
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      />

      <Typography
        fontWeight="bold"
        sx={{ paddingLeft: "5px" }}
      >
        {userProperties.name}
      </Typography>

      <PointsStats
        pointsProperties={{
          points: userProperties.points,
          points_up: userProperties.points_up,
          points_down: userProperties.points_down,
        }}
      />
    </Stack>
  );
}

export function capString(s: string, max: number = 150) {
  return s.length > max ? s.substring(0, max) + "..." : s;
}

export function ItemFloatingText({
  itemProperties,
}: {
  itemProperties: ItemProperties;
}) {
  return (
    <Stack spacing={1}>
      <Chip
        icon={<DescriptionIcon />}
        color="primary"
        label="Item"
        size="small"
        sx={{
          p: "5px",
          maxWidth: "max-content",
          backgroundColor: "green",
          "& .MuiChip-label": {
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      />

      <Typography fontWeight="bold">
        {itemProperties.title}
      </Typography>

      <PointsStats
        pointsProperties={{
          points: itemProperties.points,
          points_up: itemProperties.points_up,
          points_down: itemProperties.points_down,
        }}
      />

      <Typography
        variant="caption"
        sx={{ wordWrap: "break-word" }}
      >
        {capString(itemProperties.content)}
      </Typography>
    </Stack>
  );
}

export function TagFloatingText({
  tagProperties,
}: {
  tagProperties: TagProperties;
}) {
  return (
    <Stack alignItems="center" spacing={1}>
      <Chip
        icon={<TagIcon />}
        color="primary"
        label="Tag"
        size="small"
        sx={{
          p: "5px",
          maxWidth: "max-content",
          backgroundColor: "darkcyan",
          "& .MuiChip-label": {
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      />
      <Typography fontWeight="bold">
        {tagProperties.title}
      </Typography>
    </Stack>
  );
}

export function HyperlinkFloatingText({
  hyperlinkProperties,
}: {
  hyperlinkProperties: HyperlinkProperties;
}) {
  const a = document.createElement("a");
  a.href = hyperlinkProperties.link;
  const host = a.hostname;

  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
        <Chip
          icon={<LinkIcon />}
          color="primary"
          label="Link"
          size="small"
          sx={{
            p: "5px",
            maxWidth: "max-content",
            backgroundColor: "cornflowerblue",
            "& .MuiChip-label": {
              fontSize: 16,
              fontWeight: "bold",
            },
          }}
        />
        <Typography sx={{ wordWrap: "break-word" }}>
          <Link sx={{ textDecoration: "none" }} href={host}>
            {capString(host, 60)}
          </Link>
        </Typography>
      </Stack>
      <Typography
        variant="caption"
        sx={{ pl: "12px", wordWrap: "break-word" }}
      >
        <Link
          href={hyperlinkProperties.link}
          sx={{ textDecoration: "none" }}
        >
          {capString(hyperlinkProperties.link, 60)}
        </Link>
      </Typography>
    </Stack>
  );
}
