import { Installation } from "../core/models/Installation";
import { InstallationProgress } from "../core/models/InstallationProgress";
import { Resource } from "../core/models/Resource";

export interface BridgeEventList {
  test: Record<string, never>;

  requestAddBms: { specUrl: string };
  requestAddGroup: { manifestUrl: string };
  requestCheckUpdates: Record<string, never>;

  acceptProposedInstallations: { installations: Installation[] };

  installationsUpdated: {
    installations: Installation[];
  };
  installationProgressesUpdated: {
    installationProgresses: InstallationProgress[];
  };
}
