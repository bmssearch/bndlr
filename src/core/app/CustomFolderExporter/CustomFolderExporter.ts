import { Bms } from "../../models/Bms";
import { Group } from "../../models/Group";

interface GroupBmsList {
  group: Group;
  bmses: Bms[];
}

export abstract class CustomFolderExporter {
  constructor(
    protected dest: string,
    protected groupBmsLists: GroupBmsList[]
  ) {}

  abstract clean: () => Promise<void>;

  abstract export: () => Promise<void>;
}
