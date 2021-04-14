import "../reset.scss";
import "../global.scss";

import React, { useCallback, useEffect, useState } from "react";

import { GeneralTab } from "./tabs/GeneralTab";
import { GroupTab } from "./tabs/GroupTab";
import { ManifestTab } from "./tabs/ManifestTab";
import { Menu } from "./components/Menu";
import { ObservationTab } from "./tabs/ObservationTab";
import { Preferences } from "../../core/models/Preference";
import { PreferencesInput } from "./types";
import { ResourceTab } from "./tabs/ResourceTab";
import { Tab } from "./tab";
import { api } from "../../api/api";
import styles from "./App.module.scss";
import { useFormik } from "formik";
import { usePreferences } from "../fetcher/usePreferences";

const initialValues: PreferencesInput = {
  coreResourceSelectionMethod: "first",
  installsPatchResources: false,
  installsAdditionalResources: false,

  downloadUnsupportedDomains: "",
  installationDist: "",
  lr2CustomFolderDist: "",

  identicalDomainsList: "",

  intervalMin: 1,
  launchOnStartup: false,
};

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>("resource");

  const onSubmit = useCallback((data: PreferencesInput) => {
    const preferences: Preferences = {
      installationDist: data.installationDist,
      lr2CustomFolderDist: data.lr2CustomFolderDist,
      coreResourceSelectionMethod: data.coreResourceSelectionMethod,
      installsPatchResources: data.installsPatchResources,
      installsAdditionalResources: data.installsAdditionalResources,
      downloadUnsupportedDomains: data.downloadUnsupportedDomains.split("\n"),
      identicalDomainsList: data.identicalDomainsList
        .split("\n")
        .map((v) => v.split(",").map((c) => c.trim())),
      observationIntervalMin: Number.isNaN(Number(data.intervalMin))
        ? 1
        : Number(data.intervalMin),
      launchOnStartup: data.launchOnStartup,
    };
    api.setPreferences(preferences);
    api.closePreferencesWindow();
  }, []);

  const formik = useFormik<PreferencesInput>({
    initialValues,
    onSubmit,
  });
  const { setValues } = formik;

  const preferences = usePreferences();
  useEffect(() => {
    if (!preferences) return;
    setValues({
      coreResourceSelectionMethod: preferences.coreResourceSelectionMethod,
      installsPatchResources: preferences.installsPatchResources,
      installsAdditionalResources: preferences.installsAdditionalResources,

      downloadUnsupportedDomains: preferences.downloadUnsupportedDomains.join(
        "\n"
      ),
      installationDist: preferences.installationDist,
      lr2CustomFolderDist: preferences.lr2CustomFolderDist,

      identicalDomainsList: preferences.identicalDomainsList
        .map((v) => v.join(","))
        .join("\n"),

      intervalMin: preferences.observationIntervalMin,
      launchOnStartup: preferences.launchOnStartup,
    });
  }, [preferences, setValues]);

  return (
    <div className={styles.wrapper}>
      <Menu tab={tab} onChange={setTab} />
      <form onSubmit={formik.handleSubmit} className={styles.body}>
        <div>
          {tab === "resource" && <ResourceTab formik={formik} />}
          {tab === "manifest" && <ManifestTab formik={formik} />}
          {tab === "group" && <GroupTab formik={formik} />}
          {tab === "observation" && <ObservationTab formik={formik} />}
          {tab === "general" && <GeneralTab formik={formik} />}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            style={{ marginRight: 8 }}
            onClick={() => {
              api.closePreferencesWindow();
            }}
          >
            キャンセル
          </button>
          <button type="submit">OK</button>
        </div>
      </form>
    </div>
  );
};

export default App;
