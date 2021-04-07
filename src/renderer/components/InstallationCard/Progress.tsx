import {
  InstallationProgress,
  InstallationProgressProgress,
} from "../../../core/models/InstallationProgress";

import { ProgressBar } from "../ProgressBar";
import React from "react";

interface Props {
  progress: InstallationProgress;
  className?: string;
}

const progressLabel: {
  [key in InstallationProgressProgress["type"]]: string;
} = {
  queued: "待機中",
  connecting: "接続中",
  transferring: "ダウンロード中",
  extracting: "展開中",
  copying: "移動中",
  cleaning: "クリーンアップ中",
};

export const Progress: React.FC<Props> = ({ progress, className }) => {
  return (
    <div className={className}>
      {progress.progress?.type === "transferring" &&
      progress.progress.totalByte ? (
        <ProgressBar
          type="determinate"
          progress={
            progress.progress.transferedByte / progress.progress.totalByte
          }
        />
      ) : (
        <ProgressBar type="indeterminate" />
      )}

      <p style={{ marginTop: 6 }}>
        {progress.progress ? progressLabel[progress.progress.type] : "準備中"}
        {progress.progress?.type === "transferring" &&
          `・${
            progress.progress.totalByte &&
            Math.floor(
              (progress.progress.transferedByte * 100) /
                progress.progress.totalByte
            )
          }% (${Math.floor(progress.progress.transferedByte / 1024)}KB${
            progress.progress.totalByte &&
            `/${Math.floor(progress.progress.totalByte / 1024)}KB`
          })`}
      </p>
    </div>
  );
};
