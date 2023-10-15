import { GraphProps } from "../../../lib/models/react_force_helpers";

import ForceGraph2D from "react-force-graph-2d";

export function Graph2d({ data }: GraphProps) {
  return <ForceGraph2D graphData={data} />;
}
