import { ObservationRepository } from "../repositories/ObservationRepository";

export class ObservationRegistrar {
  constructor(private observationRepository: ObservationRepository) {}

  public register = async (updatesManifestUrl: string, checkedAt: Date) => {
    await this.observationRepository.createOrIgnore(
      updatesManifestUrl,
      checkedAt
    );
  };
}
