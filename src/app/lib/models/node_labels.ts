export enum NeoNodeLabel {
  User = "User",
  Item = "Item",
  Connection = "Connection",
  Comment = "Comment",
  Tag = "Tag",
  Hyperlink = "Hyperlink",
}

export function stringToNeoNodeLabel(
  s: string
): NeoNodeLabel {
  return Object.values(NeoNodeLabel).find(
    (nodeLabel) => nodeLabel === s
  )!;
}
