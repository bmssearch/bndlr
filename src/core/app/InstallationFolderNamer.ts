import { Bms } from "../models/Bms";
import sanitize from "sanitize-filename";

export class InstallationFolderNamer {
  public name = (bms: Bms): string => {
    return sanitize(`${bms.domain}_${bms.domainScopedId}`);
  };
}
