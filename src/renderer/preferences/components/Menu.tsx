import React from "react";
import { Tab } from "../tab";
import clsx from "clsx";
import styles from "./Menu.module.scss";

interface Props {
  tab: Tab;
  onChange: (tab: Tab) => void;
}
export const Menu: React.FC<Props> = ({ tab, onChange }) => {
  return (
    <ul className={styles.wrapper}>
      <li>
        <button
          className={clsx(styles.tab, tab === "resource" && styles.active)}
          onClick={() => onChange("resource")}
        >
          リソース
        </button>
      </li>
      <li>
        <button
          className={clsx(styles.tab, tab === "manifest" && styles.active)}
          onClick={() => onChange("manifest")}
        >
          マニフェスト
        </button>
      </li>

      <li>
        <button
          className={clsx(styles.tab, tab === "group" && styles.active)}
          onClick={() => onChange("group")}
        >
          グループ
        </button>
      </li>

      <li>
        <button
          className={clsx(styles.tab, tab === "observation" && styles.active)}
          onClick={() => onChange("observation")}
        >
          更新監視
        </button>
      </li>

      <li>
        <button
          className={clsx(styles.tab, tab === "general" && styles.active)}
          onClick={() => onChange("general")}
        >
          一般
        </button>
      </li>
    </ul>
  );
};
