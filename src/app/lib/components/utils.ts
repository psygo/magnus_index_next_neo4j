export type NodePos = {
  x: number;
  y: number;
};

export function capString(s: string, max: number = 150) {
  return s.length > max ? s.substring(0, max) + "..." : s;
}
