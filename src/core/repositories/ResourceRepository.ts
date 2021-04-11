import { Resource } from "../models/Resource";
import { ResourceManifest } from "../models/ResourceManifest";

export interface ResourceRepository {
  fetch: (bmsId: number, url: string) => Promise<Resource | null>;
  save: (Resource: ResourceManifest, bmsId: number) => Promise<Resource>;
}
