import {
  Installation,
  InstallationStatus,
} from "../../../../core/models/Installation";

import { Button } from "../Button";
import { DateTime } from "luxon";
import { InstallationProgress } from "../../../../core/models/InstallationProgress";
import { Progress } from "./Progress";
import React from "react";
import { ResourceType } from "../../../../core/models/Resource";
import clsx from "clsx";
import downloadIconImg from "./assets/download.png";
import failedIconImg from "./assets/failed.png";
import installedIconImg from "./assets/installed.png";
import proposedIconImg from "./assets/proposed.png";
import skippedIconImg from "./assets/skipped.png";
import styles from "./index.module.scss";

interface Props {
  installation: Installation;
  progress?: InstallationProgress;
  onPressInstall: (installation: Installation) => void;
  onPressSkip: (installation: Installation) => void;
}

const icons: { [key in InstallationStatus]: string } = {
  proposed: proposedIconImg,
  installed: installedIconImg,
  failed: failedIconImg,
  skipped: skippedIconImg,
};

const statusClassNames: { [key in InstallationStatus]: string } = {
  proposed: styles.proposed,
  installed: styles.installed,
  failed: styles.failed,
  skipped: styles.skipped,
};

const resourceTypeLabel: { [key in ResourceType]: string } = {
  core: "本体",
  additional: "追加差分",
  patch: "修正差分",
};

export const InstallationCard: React.FC<Props> = ({
  installation,
  progress,
  onPressInstall,
  onPressSkip,
}) => {
  return (
    <div
      className={clsx(
        styles.wrapper,
        statusClassNames[installation.status],
        progress && styles.processing
      )}
    >
      <img
        src={icons[installation.status]}
        className={styles.icon}
        style={{ marginRight: 8 }}
        alt=""
      />
      <p className={styles.type}>
        {resourceTypeLabel[installation.resource.type]}
        {installation.resource.name && `・${installation.resource.name}`}
      </p>
      <p className={styles.bms} style={{ marginTop: 2 }}>
        {installation.resource.bms.title}
      </p>
      <p className={styles.url} style={{ marginTop: 4 }}>
        {installation.resource.url}
      </p>
      <p className={styles.updated_at}>
        {DateTime.fromJSDate(installation.createdAt).toRelative()}
      </p>
      {installation.status === "proposed" && !progress && (
        <div className={clsx(styles.actions, styles.buttons)}>
          <Button
            label="Skip"
            variant="secondary"
            style={{ marginRight: 4 }}
            onPress={() => onPressSkip(installation)}
          />
          <Button
            label="DL"
            iconUri={downloadIconImg}
            onPress={() => onPressInstall(installation)}
          />
        </div>
      )}

      {installation.status === "failed" && (
        <p className={styles.status}>自動インストールに失敗しました</p>
      )}

      {progress && <Progress className={styles.status} progress={progress} />}
    </div>
  );
};
