import { Installation } from "../core/models/Installation";
import { InstallationProgress } from "../core/models/InstallationProgress";
import { Resource } from "../core/models/Resource";

export interface BridgeEventList {
  test: Record<string, never>;

  requestAddBms: { specUrl: string };
  acceptProposedInstallations: { installations: Installation[] };

  installationsUpdated: {
    installations: Installation[];
  };
  installationProgressesUpdated: {
    installationProgresses: InstallationProgress[];
  };
}
