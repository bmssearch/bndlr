import { useEffect, useState } from "react";

import { Installation } from "../../core/models/Installation";
import { api } from "../../api/api";

export const useInstallations = () => {
  const [installations, setInstallations] = useState<Installation[]>();

  useEffect(() => {
    api.fetchInstallations();
  }, []);

  useEffect(() => {
    return api.listenToInstallations((event, { installations }) => {
      setInstallations(installations);
    });
  }, []);

  return installations;
};
