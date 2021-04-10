import { FormikType } from "../types";
import React from "react";
import { api } from "../../../api/api";

interface Props {
  formik: FormikType;
}
export const ResourceTab: React.FC<Props> = ({ formik }) => {
  return (
    <div>
      <label>
        <p>インストール先</p>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            disabled={true}
            value={formik.values.installationDist}
            style={{ flex: 1, marginRight: 4 }}
          />
          <button
            type="button"
            onClick={async () => {
              const path = await api.selectDirectory();
              if (!path) return;
              formik.setFieldValue("installationDist", path);
            }}
          >
            選択
          </button>
        </div>
      </label>

      <label style={{ marginTop: 24 }}>
        <input
          type="checkbox"
          name="installsPatchResources"
          checked={formik.values.installsPatchResources}
          onChange={formik.handleChange}
        />
        <span>修正差分をインストールする</span>
      </label>

      <label>
        <input
          type="checkbox"
          name="installsAdditionalResources"
          checked={formik.values.installsAdditionalResources}
          onChange={formik.handleChange}
        />
        <span>追加差分をインストールする</span>
      </label>

      <label style={{ marginTop: 24 }}>
        <span>自動インストールしないリソースドメイン</span>
        <textarea
          name="downloadUnsupportedDomains"
          value={formik.values.downloadUnsupportedDomains}
          onChange={formik.handleChange}
          rows={4}
        />
      </label>
    </div>
  );
};
