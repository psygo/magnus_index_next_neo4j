export type NodeBase = {
  labels: string[];
  elementId: string;
  properties: User | Item | Connection;
};

export type User = {
  email: string;
  name: string;
};

export type Item = {
  title: string;
  content: string;
};

export type Connection = {
  title: string;
};
