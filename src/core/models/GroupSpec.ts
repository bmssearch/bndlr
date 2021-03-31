import { Group as BbsGroup } from "@bmssearch/bms-bundle-spec";
import nodePath from "path";

const ROOT_DIR = "F:\\temporary\\BMS";

export class GroupSpec {
  constructor(
    public readonly specUrl: string,
    public readonly bbsGroup: BbsGroup
  ) {}

  public getDirectory = (): string => {
    // TODO: ファイル名として安全なものに変換する
    return nodePath.join(ROOT_DIR, this.bbsGroup.name);
  };
}
