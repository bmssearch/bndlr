export type CoreResourceSelectionMethod = "first" | "latest";

export interface Preferences {
  installationDist: string;
  lr2CustomFolderDist: string;

  coreResourceSelectionMethod: CoreResourceSelectionMethod;
  installsPatchResources: boolean;
  installsAdditionalResources: boolean;

  downloadUnsupportedDomains: string[];
  identicalDomainsList: string[][];

  observationIntervalMin: number;

  launchOnStartup: boolean;
}
