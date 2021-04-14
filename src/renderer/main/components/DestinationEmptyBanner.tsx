import React from "react";
import styles from "./DestinationEmptyBanner.module.scss";

export const DestinationEmptyBanner = () => {
  return (
    <div className={styles.wrapper}>
      設定からインストール先フォルダを指定してください。
    </div>
  );
};
