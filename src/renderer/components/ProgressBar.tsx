import React from "react";
import clsx from "clsx";
import styles from "./ProgressBar.module.scss";

interface DeterminateProps {
  type: "determinate";
  progress: number; // 0 to 1
}
interface IndeterminateProps {
  type: "indeterminate";
}

type Props = DeterminateProps | IndeterminateProps;

export const ProgressBar: React.FC<Props> = (props) => {
  switch (props.type) {
    case "indeterminate":
      return (
        <div className={styles.wrapper}>
          <div className={clsx(styles.gutter, styles.indeterminate)} />
          <div className={clsx(styles.subline, styles.inc)} />
          <div className={clsx(styles.subline, styles.dec)} />
        </div>
      );
    case "determinate":
      return (
        <div className={clsx(styles.wrapper)}>
          <div className={clsx(styles.gutter, styles.indeterminate)} />
          <div
            className={clsx(styles.subline)}
            style={{ width: `${props.progress * 100}%` }}
          />
        </div>
      );
  }
};
