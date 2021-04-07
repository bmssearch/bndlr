import { InstallationRepository } from "../repositories/InstallationRepository";
import { ResourceManifest } from "../models/ResourceManifest";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { isUpToDate } from "../utils/date";

export class ResourceRegistrar {
  constructor(
    private resourceRepository: ResourceRepository,
    private installationRepository: InstallationRepository
  ) {}

  public register = async (
    resourceManifest: ResourceManifest,
    bmsId: number
  ) => {
    // リソース自体の情報は常に更新しておく
    const resource = await this.resourceRepository.save(
      resourceManifest,
      bmsId
    );

    const latestInstallation = await this.installationRepository.fetchLatestForResource(
      resource.id
    );

    if (isUpToDate(resourceManifest.updatedAt, latestInstallation?.createdAt)) {
      return;
    }

    if (latestInstallation?.status === "proposed") {
      await this.installationRepository.updateStatus(
        latestInstallation.id,
        "skipped"
      );
    }

    await this.installationRepository.create(resource.id);
    return;
  };
}
