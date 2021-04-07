import React from "react";
import clsx from "clsx";
import styles from "./Header.module.scss";

interface Props {
  title: string;
  className?: string;
}

export const Header: React.FC<Props> = ({ title, className }) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <p className={styles.title}>{title}</p>{" "}
    </div>
  );
};
