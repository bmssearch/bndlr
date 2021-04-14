import { FormikType } from "../types";
import React from "react";
import { api } from "../../../api/api";

interface Props {
  formik: FormikType;
}
export const GroupTab: React.FC<Props> = ({ formik }) => {
  return (
    <div>
      <p>LR2カスタムフォルダインストール先</p>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          disabled={true}
          value={formik.values.lr2CustomFolderDist}
          style={{ flex: 1, marginRight: 4 }}
        />
        <button
          type="button"
          onClick={async () => {
            const path = await api.selectDirectory();
            if (!path) return;
            formik.setFieldValue("lr2CustomFolderDist", path);
          }}
        >
          選択
        </button>
      </div>
    </div>
  );
};
