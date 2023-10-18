export type NodeBase = {
  labels: string[];
  elementId: string;
  properties: User | Item | Connection;
};

export type User = {
  type: "user";
  email: string;
  name: string;
};

export type Item = {
  type: "item";
  title: string;
  content: string;
};

export type Connection = {
  type: "connection";
  title: string;
};
