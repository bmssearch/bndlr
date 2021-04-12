export abstract class Extractor {
  next?: Extractor;

  constructor(protected maxExtractedSizeByte: number) {}

  public setNext = (extractor: Extractor) => {
    this.next = extractor;
    return extractor;
  };

  abstract extract: (filePath: string, dist: string) => Promise<void>;
}

export abstract class ExtractorFactoryAbstract {
  constructor(protected maxExtractedSizeByte: number) {}

  abstract create: () => Extractor;
}
