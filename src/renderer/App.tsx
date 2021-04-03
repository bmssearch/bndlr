import React, { useCallback, useEffect, useState } from "react";

import { Resource } from "../core/models/Resource";
import { api } from "../api/api";
import styles from "./App.module.scss";

const App: React.FC = () => {
  const [specUrl, setSpecUrl] = useState(
    "https://venue.bmssearch.net/bmsshuin3/72"
  );

  const [resources, setResources] = useState<Resource[]>([]);

  const onClickButton = useCallback(() => {
    api.requestAddBms(specUrl);
  }, [specUrl]);

  useEffect(() => {
    return api.listenToInstallationProposalsUpdate(
      (e, { installationProposals }) => {
        console.log("これが一覧だ", installationProposals);
        setResources([]);
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
      {resources.map((res) => {
        return (
          <div key={res.id}>
            <p>{res.url}</p>
            <p>{res.type}</p>
            <div>
              <button onClick={() => api.requestInstallResources([res])}>
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
