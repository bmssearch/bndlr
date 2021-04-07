import React from "react";
import clsx from "clsx";
import menuButtonImg from "./assets/menu.png";
import styles from "./index.module.scss";

interface Props {
  className?: string;
}

export const AppBar: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <p>bndlr</p>
      <div className={styles.menu}>
        <img src={menuButtonImg} alt="" />
      </div>
    </div>
  );
};
