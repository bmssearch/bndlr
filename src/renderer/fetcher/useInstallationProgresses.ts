import { useEffect, useState } from "react";

import { InstallationProgress } from "../../core/models/InstallationProgress";
import { api } from "../../api/api";

export const useInstallationProgresses = () => {
  const [progressMap, setProgressMap] = useState<
    Map<number, InstallationProgress>
  >(new Map());

  useEffect(() => {
    return api.listenToInstallationProgresses(
      (e, { installationProgresses }) => {
        const map = new Map<number, InstallationProgress>();
        for (const progress of installationProgresses) {
          map.set(progress.installationId, progress);
        }
        setProgressMap(map);
      }
    );
  });

  return progressMap;
};
