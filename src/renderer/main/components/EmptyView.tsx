import React from "react";
import styles from "./EmptyView.module.scss";

export const EmptyView = () => {
  return (
    <div className={styles.wrapper}>
      準備できたインストールがありません。
      <br />
      マニフェストを読み込んでBMSを追加することができます。
    </div>
  );
};
