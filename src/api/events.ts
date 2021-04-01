import { Resource } from "../core/models/Resource";

export interface EventList {
  test: Record<string, never>;

  requestAddBms: { specUrl: string };
  requestInstallResources: { resources: Resource[] };

  updateResources: { resources: Resource[] };
}

export type EventKey = keyof EventList;
