import { FormikType } from "../types";
import React from "react";
import styles from "./common.module.scss";

interface Props {
  formik: FormikType;
}
export const ManifestTab: React.FC<Props> = ({ formik }) => {
  return (
    <div>
      <label>
        <span>同一ドメイン設定</span>
        <textarea
          name="identicalDomainsList"
          value={formik.values.identicalDomainsList}
          onChange={formik.handleChange}
          placeholder={`before.example.com,after.example.com\nexample.com,sp.example.com,pc.example.com`}
          rows={4}
        />
        <p className={styles.note} style={{ marginTop: 8 }}>
          マニフェストの domainScopedId のスコープを共有するドメイン群です。
          <br />
          サイトの移転等によりドメインが変わったが、同一のマニフェストを提供している場合に登録します。
          <br />
          同一とみなすドメインをコンマ区切りで1行に記載します。
        </p>
      </label>
    </div>
  );
};
