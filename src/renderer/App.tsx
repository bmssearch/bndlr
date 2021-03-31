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
    api.addBms(specUrl);
  }, [specUrl]);

  useEffect(() => {
    return api.listenToResourceQueues((e, { resources }) => {
      console.log("これが一覧だ", resources);
      setResources(resources);
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
          <p key={res.id}>
            {res.url} {res.type}
          </p>
        );
      })}
      <button onClick={onClickButton}>BUTTON</button>
    </div>
  );
};

export default App;
