import { ResourceSpec } from "../models/ResourceSpec";

type ResourceFilterCoreMethod = "first" | "latest";

export interface ResourceFilterConfig {
  core: {
    selectionMethod: ResourceFilterCoreMethod;
  };
  patch: {
    enabled: boolean;
  };
  additional: {
    enabled: boolean;
  };
}

export class ResourceFilter {
  constructor(private config: ResourceFilterConfig) {}

  public filter = (resources: ResourceSpec[]) => {
    const filteredResources: ResourceSpec[] = [];

    const coreResources = resources.filter((res) => res.type === "core");
    if (coreResources.length > 0) {
      switch (this.config.core.selectionMethod) {
        case "first": {
          const first = coreResources[0];
          filteredResources.push(first);
          break;
        }
        case "latest": {
          const latest = coreResources.reduce((a, b) => {
            if (!b.updated_at) return a;
            if (!a.updated_at) return b;
            return a.updated_at < b.updated_at ? b : a;
          });
          filteredResources.push(latest);
          break;
        }
        default:
          throw new Error("invalid core resource selection method");
      }
    }

    if (this.config.patch.enabled) {
      const patchResources = resources.filter((res) => res.type === "patch");
      filteredResources.push(...patchResources);
    }

    if (this.config.additional.enabled) {
      const additionalResources = resources.filter(
        (res) => res.type === "additional"
      );
      filteredResources.push(...additionalResources);
    }

    return filteredResources;
  };
}
