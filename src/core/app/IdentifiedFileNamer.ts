import { Identifier } from "../models/Identity";
import sanitize from "sanitize-filename";

export class IdentifiedFileNamer {
  public name = (identifier: Identifier): string => {
    return sanitize(`${identifier.domain}_${identifier.domainScopedId}`);
  };
}
