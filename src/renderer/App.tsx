import React, { useCallback, useEffect, useState } from "react";

import { Installation } from "../core/models/Installation";
import { InstallationProgress } from "../core/models/InstallationProgress";
import { api } from "../api/api";
import styles from "./App.module.scss";

const App: React.FC = () => {
  const [specUrl, setSpecUrl] = useState(
    "https://venue.bmssearch.net/bmsshuin3/72"
  );

  const [installations, setInstallations] = useState<Installation[]>([]);
  const [progressMap, setProgressMap] = useState<
    Map<number, InstallationProgress>
  >(new Map());

  const onClickButton = useCallback(() => {
    api.requestAddBms(specUrl);
  }, [specUrl]);

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

  return (
    <div>
      <h2 className={styles.sample}>HELLO WOR</h2>
      <input
        type="text"
        value={specUrl}
        onChange={(e) => setSpecUrl(e.target.value)}
      />
      {installations.map((installation) => {
        const prog = progressMap.get(installation.id);
        return (
          <div key={installation.id}>
            {prog && (
              <p>
                処理中
                {prog.progress?.type}
                {prog.progress?.type === "transferring" &&
                prog.progress.totalByte
                  ? `${
                      (prog.progress.transferedByte * 100) /
                      prog.progress.totalByte
                    }%`
                  : "-"}
              </p>
            )}
            <p>{installation.resource.bms.title}</p>
            <p>{installation.resource.url}</p>
            <p>{installation.createdAt.toLocaleString()}</p>
            <p>{installation.status}</p>
            <div>
              <button
                disabled={!!prog}
                onClick={() => api.acceptProposedInstallation([installation])}
              >
                ダウンロード
              </button>
            </div>
          </div>
        );
      })}
      <button onClick={onClickButton}>BUTTON</button>
      <button onClick={() => api.test()}>TEST</button>
    </div>
  );
};

export default App;
