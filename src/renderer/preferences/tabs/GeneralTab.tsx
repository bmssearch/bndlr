import { FormikType } from "../types";
import React from "react";

interface Props {
  formik: FormikType;
}
export const GeneralTab: React.FC<Props> = ({ formik }) => {
  return (
    <div>
      <label>
        <input
          type="checkbox"
          name="launchOnStartup"
          checked={formik.values.launchOnStartup}
          onChange={formik.handleChange}
        />
        <span>スタートアップ時に起動する</span>
      </label>
    </div>
  );
};
