import {
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Link as LinkIcon } from "@mui/icons-material";

import { HyperlinkProperties } from "@models/hyperlink_models";

import { capString } from "@components/utils";

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
