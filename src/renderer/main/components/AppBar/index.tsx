import React from "react";
import { api } from "../../../../api/api";
import clsx from "clsx";
import logoImg from "./assets/logo.png";
import menuButtonImg from "./assets/menu.png";
import styles from "./index.module.scss";

interface Props {
  className?: string;
}

export const AppBar: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <img className={styles.logo} src={logoImg} alt="" />
      <div
        className={styles.menu}
        onClick={() => {
          api.openMenu();
        }}
      >
        <img src={menuButtonImg} alt="" />
      </div>
    </div>
  );
};
