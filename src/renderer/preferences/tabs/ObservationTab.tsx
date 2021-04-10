import { FormikType } from "../types";
import React from "react";

interface Props {
  formik: FormikType;
}
export const ObservationTab: React.FC<Props> = ({ formik }) => {
  return (
    <div>
      <label>
        <span>更新チェック頻度（分）</span>
        <input
          type="number"
          name="intervalMin"
          value={formik.values.intervalMin}
          onChange={formik.handleChange}
          style={{ flex: 1, marginRight: 4 }}
        />
      </label>
    </div>
  );
};
