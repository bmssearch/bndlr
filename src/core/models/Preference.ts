export interface Preferences {
  resourcePreferences: ResourcePreferences;
  manifestPreferences: ManifestPreferences;
  observationPreferences: ObservationPreferences;
}

export type CoreResourceSelectionMethod = "first" | "latest";

export interface ResourcePreferences {
  coreResourceSelectionMethod: CoreResourceSelectionMethod;
  installsPatchResources: boolean;
  installsAdditionalResources: boolean;

  downloadUnsupportedDomains: string[];
  installationDist: string;
}

export interface ManifestPreferences {
  identicalDomainsList: string[][];
}

export interface ObservationPreferences {
  intervalMin: number;
}
