import { Installation } from "../core/models/Installation";
import { InstallationProgress } from "../core/models/InstallationProgress";
import { Preferences } from "../core/models/Preference";

export interface BridgeEventList {
  test: Record<string, never>;

  // ui
  selectDirectory: Record<string, never>;
  openMenu: Record<string, never>;

  fetchPreferences: Record<string, never>;
  preferencesLoaded: { preferences: Preferences };
  setPreferences: { preferences: Preferences };
  closePreferencesWindow: Record<string, never>;

  requestAddBms: { manifestUrl: string };
  requestAddGroup: { manifestUrl: string };

  fetchInstallations: Record<string, never>;
  acceptProposedInstallations: { installations: Installation[] };
  installationsLoaded: {
    installations: Installation[];
  };
  installationProgressesLoaded: {
    installationProgresses: InstallationProgress[];
  };
}
