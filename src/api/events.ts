import { Installation } from "../core/models/Installation";
import { InstallationProgress } from "../core/models/InstallationProgress";

export interface BridgeEventList {
  test: Record<string, never>;

  requestAddBms: { manifestUrl: string };
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
