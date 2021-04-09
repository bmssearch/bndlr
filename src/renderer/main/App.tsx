import "../reset.scss";
import "./global.scss";

import React, { useEffect, useMemo, useState } from "react";

import { AppBar } from "./components/AppBar";
import { GroupedInstallationCard } from "./components/GroupedInstallationCard";
import { Header } from "./components/Header";
import { Installation } from "../../core/models/Installation";
import { InstallationCard } from "./components/InstallationCard";
import { InstallationProgress } from "../../core/models/InstallationProgress";
import { api } from "../../api/api";
import { chain } from "lodash";
import styles from "./App.module.scss";

const App: React.FC = () => {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [progressMap, setProgressMap] = useState<
    Map<number, InstallationProgress>
  >(new Map());

  useEffect(() => {
    return api.listenToInstallationsUpdate((e, { installations }) => {
      setInstallations(installations);
    });
  });

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

  useEffect(() => {
    return api.listenToTest(() => {
      console.log("TEST");
    });
  });

  const proposedBmsGroups = useMemo(() => {
    const proposedInstallations = installations.filter(
      (v) => v.status === "proposed"
    );
    const res = chain(proposedInstallations)
      .groupBy((item) => item.resource.bms.id)
      .map((v) => ({ bms: v[0].resource.bms, installations: v }))
      .value();
    return res;
  }, [installations]);

  return (
    <div className={styles.wrapper}>
      <AppBar />
      {proposedBmsGroups.length > 0 && <Header title="一括" />}
      {proposedBmsGroups.map((bmsGroup) => (
        <GroupedInstallationCard
          key={bmsGroup.bms.id}
          bms={bmsGroup.bms}
          installations={bmsGroup.installations}
          onPressInstall={() => {
            // no op
          }}
          onPressSkip={() => {
            // no op
          }}
        />
      ))}
      <Header title="個別" />
      {installations.map((installation) => {
        const progress = progressMap.get(installation.id);
        return (
          <InstallationCard
            key={installation.id}
            installation={installation}
            onPressInstall={(installation) => {
              api.acceptProposedInstallation([installation]);
            }}
            onPressSkip={() => {
              // no op
            }}
            progress={progress}
          />
        );
      })}
      <button onClick={() => api.requestAddBms("https://ser")}>Add Bms</button>
      <button onClick={() => api.requestAddGroup("test")}>Add Group</button>
      <button onClick={() => api.requestCheckUpdates()}>Check Updates</button>
      <button onClick={() => api.test()}>TEST</button>
    </div>
  );
};

export default App;
