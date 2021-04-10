import { useEffect, useState } from "react";

import { Preferences } from "../../core/models/Preference";
import { api } from "../../api/api";

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>();

  useEffect(() => {
    api.fetchPreferences();
  }, []);

  useEffect(() => {
    return api.listenToPreferences((event, { preferences }) => {
      setPreferences(preferences);
    });
  }, []);

  return preferences;
};
