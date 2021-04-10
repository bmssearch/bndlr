import { FormikType } from "../types";
import React from "react";

interface Props {
  formik: FormikType;
}
export const GroupTab: React.FC<Props> = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>domain</th>
            <th>グループ</th>
            <th>自動追加</th>
            <th>カスタムフォルダ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>venue.bmssearch.net</td>
            <td>グループ</td>
            <td>
              <input type="checkbox" />
            </td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
