import { RawSchema } from "../../types";

export interface SpecFetcher {
  fetch: (url: string) => Promise<RawSchema>;
}

export class HttpsSpecFetcher implements SpecFetcher {
  public fetch = async (url: string) => {
    return {};
  };
}

export class MockSpecFetcher implements SpecFetcher {
  constructor(private mockSchema: RawSchema) {}

  public fetch = async (url: string) => {
    return this.mockSchema;
  };
}
