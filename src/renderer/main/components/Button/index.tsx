import React, { CSSProperties } from "react";

import clsx from "clsx";
import styles from "./index.module.scss";

type Variant = "primary" | "secondary";

interface Props {
  label: string;
  iconUri?: string;
  onPress: () => void;
  variant?: Variant;
  style?: CSSProperties;
}

const variantClassName: { [key in Variant]: string } = {
  primary: styles.primary,
  secondary: styles.secondary,
};

export const Button: React.FC<Props> = ({
  label,
  iconUri,
  onPress,
  variant = "primary",
  style,
}) => {
  return (
    <button
      className={clsx(styles.wrapper, variantClassName[variant])}
      style={style}
      onClick={onPress}
    >
      {iconUri && <img className={styles.icon} src={iconUri} />}
      {label}
    </button>
  );
};
