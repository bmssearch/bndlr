import "../reset.scss";
import "../global.scss";

import React, { useMemo } from "react";

import { AppBar } from "./components/AppBar";
import { DestinationEmptyBanner } from "./components/DestinationEmptyBanner";
import { EmptyView } from "./components/EmptyView";
import { GroupedInstallationCard } from "./components/GroupedInstallationCard";
import { Header } from "./components/Header";
import { InstallationCard } from "./components/InstallationCard";
import { api } from "../../api/api";
import { chain } from "lodash";
import styles from "./App.module.scss";
import { useInstallationProgresses } from "../fetcher/useInstallationProgresses";
import { useInstallations } from "../fetcher/useInstallations";
import { usePreferences } from "../fetcher/usePreferences";

const App: React.FC = () => {
  const installations = useInstallations();
  const progressMap = useInstallationProgresses();
  const preferences = usePreferences();

  const proposedBmsGroups = useMemo(() => {
    const proposedInstallations = installations?.filter(
      (v) => v.status === "proposed" && !progressMap.has(v.id)
    );
    const res = chain(proposedInstallations)
      .groupBy((item) => item.resource.bms.id)
      .map((v) => ({ bms: v[0].resource.bms, installations: v }))
      .value();
    return res;
  }, [installations, progressMap]);

  if (!installations || !preferences) return null;

  return (
    <div className={styles.wrapper}>
      <AppBar className={styles.app_bar} />
      {!preferences.installationDist && <DestinationEmptyBanner />}

      {installations.length === 0 && <EmptyView />}

      {proposedBmsGroups.length > 0 && <Header title="一括" />}
      {proposedBmsGroups.map((proposedBmsGroup) => (
        <GroupedInstallationCard
          key={proposedBmsGroup.bms.id}
          bms={proposedBmsGroup.bms}
          installations={proposedBmsGroup.installations}
          onPressInstall={() => {
            const y = confirm(
              `以下のURLからリソースをインストールします。\n\n${proposedBmsGroup.installations
                .map((v) => v.resource.url)
                .join("\n")}`
            );
            if (y) {
              // 本体を優先してインストールする
              const cores = proposedBmsGroup.installations.filter(
                (v) => v.resource.type === "core"
              );
              const others = proposedBmsGroup.installations.filter(
                (v) => v.resource.type !== "core"
              );
              const installations = cores.concat(others);
              api.acceptProposedInstallation(installations);
            }
          }}
          onPressSkip={() => {
            const y = confirm(
              `「${proposedBmsGroup.bms.title}」の未インストールのリソースをすべてスキップしますか？`
            );
            if (y) {
              api.skipProposedInstallations(proposedBmsGroup.installations);
            }
          }}
        />
      ))}

      {installations.length > 0 && <Header title="個別" />}
      {installations.map((installation) => {
        const progress = progressMap.get(installation.id);
        return (
          <InstallationCard
            key={installation.id}
            installation={installation}
            onPressInstall={(installation) => {
              const proposedCoreInstallation = installations.find(
                (v) => v.status === "proposed" && v.resource.type === "core"
              );
              if (
                proposedCoreInstallation &&
                installation.resource.type !== "core" &&
                confirm(
                  `未インストールの本体も一緒にインストールしますか？\n\n${proposedCoreInstallation.resource.url}`
                )
              ) {
                api.acceptProposedInstallation([
                  proposedCoreInstallation,
                  installation,
                ]);
              } else {
                api.acceptProposedInstallation([installation]);
              }
            }}
            onPressSkip={() => {
              api.skipProposedInstallations([installation]);
            }}
            progress={progress}
          />
        );
      })}
    </div>
  );
};

export default App;
