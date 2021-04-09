import { ResourceManifest } from "../models/ResourceManifest";
import { urlDomain } from "../utils/url";

type CoreResourceSelectionMethod = "first" | "latest";

export interface ResourceFilterConfig {
  coreResourceSelectionMethod: CoreResourceSelectionMethod;
  installsPatchResources: boolean;
  installsAdditionalResources: boolean;
  downloadUnsupportedDomains: string[];
}

export class ResourceSelector {
  constructor(private config: ResourceFilterConfig) {}

  public select = (resources: ResourceManifest[]) => {
    const selectedResources: ResourceManifest[] = [];

    const coreResources = resources.filter((res) => res.type === "core");
    const selectedCoreResource = this.selectCoreResource(coreResources);
    if (selectedCoreResource) {
      selectedResources.push(selectedCoreResource);
    }

    if (this.config.installsPatchResources) {
      const patchResources = resources.filter((res) => res.type === "patch");
      selectedResources.push(...patchResources);
    }

    if (this.config.installsAdditionalResources) {
      const additionalResources = resources.filter(
        (res) => res.type === "additional"
      );
      selectedResources.push(...additionalResources);
    }

    return selectedResources;
  };

  private selectCoreResource = (coreResources: ResourceManifest[]) => {
    if (coreResources.length === 0) return null;

    const excludingDomainSet = new Set(this.config.downloadUnsupportedDomains);
    const downloadableResources = coreResources.filter(
      (r) => !excludingDomainSet.has(urlDomain(r.url))
    );

    if (downloadableResources.length === 0) return null;

    switch (this.config.coreResourceSelectionMethod) {
      case "first": {
        const first = downloadableResources[0];
        return first;
      }
      case "latest": {
        const latest = downloadableResources.reduce((a, b) => {
          if (!b.updatedAt) return a;
          if (!a.updatedAt) return b;
          return a.updatedAt < b.updatedAt ? b : a;
        });
        return latest;
      }
      default:
        throw new Error("invalid core resource selection method");
    }
  };
}
