// @flow
export type User = {
  avatarUrl: string,
  id: string,
  name: string,
  username: string,
};

export type Team = {
  id: string,
  name: string,
};

export type Collection = {
  createdAt: string,
  description: ?string,
  id: string,
  name: string,
  type: 'atlas' | 'journal',
  navigationTree: Object, // TODO
  updatedAt: string,
  url: string,
};

export type Document = {
  collaborators: Array<User>,
  collection: Collection,
  createdAt: string,
  createdBy: string,
  html: string,
  id: string,
  private: boolean,
  team: string,
  text: string,
  title: string,
  updatedAt: string,
  updatedBy: string,
  url: string,
};

export type Pagination = {
  limit: number,
  nextPath: string,
  offset: number,
};

export type ApiKey = {
  id: string,
  name: ?string,
  secret: string,
};
