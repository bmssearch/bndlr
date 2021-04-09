import { Preferences } from "../models/Preference";
import Store from "electron-store";

export interface PreferencesRepository {
  get: () => Promise<Preferences>;
  set: (preferences: Preferences) => Promise<void>;
}

const initialPreferences: Preferences = {
  resourcePreferences: {
    coreResourceSelectionMethod: "first",
    installsPatchResources: false,
    installsAdditionalResources: true,

    downloadUnsupportedDomains: [],
    installationDist: "",
  },
  manifestPreferences: {
    identicalDomainsList: [],
  },
  observationPreferences: { intervalMin: 60 },
};

export class StorePreferencesRepository {
  private store: Store<{ preferences: Preferences }>;

  constructor() {
    this.store = new Store<{ preferences: Preferences }>({
      migrations: {
        "0.0.1": (store) => {
          store.set("preferences", initialPreferences);
        },
      },
    });
  }

  public get = async () => {
    const preferences = this.store.get("preferences");
    return preferences;
  };

  public set = async (preferences: Preferences) => {
    this.store.set("preferences", preferences);
    return;
  };
}
