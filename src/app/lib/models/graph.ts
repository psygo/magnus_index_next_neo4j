export type NodeBase = {
  labels: string[];
  elementId: string;
  properties?:
    | UserProperties
    | ItemProperties
    | ConnectionProperties;
};

export type UserProperties = {
  email: string;
  name: string;
};

export type ItemProperties = {
  title: string;
  content: string;
};

export type ConnectionProperties = {
  title: string;
};

export type LinkBase = {
  labels: string[];
  elementId: string;
  properties?: FollowsProperties;
};

export type FollowsProperties = {
  created_at: number;
};
