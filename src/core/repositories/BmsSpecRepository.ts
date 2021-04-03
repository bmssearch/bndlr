import { BmsSpec } from "../models/BmsSpec";

export interface BmsSpecRepository {
  fetch: (specUrl: string) => Promise<BmsSpec>;
}

// export class HttpsBmsSpecRepository implements BmsSpecRepository {
//   public fetch = (specUrl: string) => {
// const bbsBmsSpec = BbsBmsSpec.assert(rawSpec);
// const bmsSpec = BmsSpec.fromSpec(specUrl, bbsBmsSpec);
//     return;
//   };
// }

export class MockBmsSpecRepository implements BmsSpecRepository {
  constructor(private bmsSpec: BmsSpec) {}

  public fetch = async () => {
    return this.bmsSpec;
  };
}
