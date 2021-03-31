import { Resource } from "../core/models/Resource";

export interface EventList {
  addBms: { specUrl: string };

  updateResources: { resources: Resource[] };
}

export type EventKey = keyof EventList;
