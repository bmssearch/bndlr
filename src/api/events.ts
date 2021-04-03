import { InstallationProposal } from "../core/models/InstallationProposal";
import { Resource } from "../core/models/Resource";

export interface BridgeEventList {
  test: Record<string, never>;

  requestAddBms: { specUrl: string };
  requestInstallResources: { resources: Resource[] };

  installationProposalsUpdated: {
    installationProposals: InstallationProposal[];
  };
}
