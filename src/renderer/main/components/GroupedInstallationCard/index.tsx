import { Bms } from "../../../../core/models/Bms";
import { Button } from "../Button";
import { Installation } from "../../../../core/models/Installation";
import React from "react";
import bundleIconImg from "./assets/bundle.png";
import clsx from "clsx";
import downloadIconImg from "./assets/download.png";
import styles from "./index.module.scss";

interface Props {
  bms: Bms;
  installations: Installation[];
  onPressInstall: (bms: Bms, installations: Installation[]) => void;
  onPressSkip: (bms: Bms, installations: Installation[]) => void;
  className?: string;
}

export const GroupedInstallationCard: React.FC<Props> = ({
  bms,
  installations,
  onPressInstall,
  onPressSkip,
  className,
}) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <img
        src={bundleIconImg}
        className={styles.icon}
        style={{ marginRight: 8 }}
        alt=""
      />
      <p className={styles.title}>{bms.title}</p>
      <div className={styles.buttons}>
        <Button
          label="Skip All"
          variant="secondary"
          style={{ marginRight: 4 }}
          onPress={() => onPressSkip(bms, installations)}
        />
        <Button
          label="DL All"
          iconUri={downloadIconImg}
          onPress={() => onPressInstall(bms, installations)}
        />
      </div>
    </div>
  );
};
