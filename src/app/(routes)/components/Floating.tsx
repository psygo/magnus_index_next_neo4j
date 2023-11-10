import {
  Chip,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Description,
  Link as LinkIcon,
  Tag as TagIcon,
} from "@mui/icons-material";

import { NodeObject } from "react-force-graph-2d";

import {
  HyperlinkProperties,
  ItemProperties,
  NeoNodeLabel,
  TagProperties,
  UserProperties,
} from "@/lib/models/exports";

import {
  FloatingPageProps,
  ItemFloatingPage,
  PointsStats,
} from "@/lib/components/exports";

export type FloatingTextProps = {
  hoverNode: NodeObject;
};

export type NodePos = {
  x: number;
  y: number;
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

export function UserFloatingText({
  userProperties,
}: {
  userProperties: UserProperties;
}) {
  return (
    <Stack spacing={1}>
      <Chip
        icon={<AccountCircle />}
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
        icon={<Description />}
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
