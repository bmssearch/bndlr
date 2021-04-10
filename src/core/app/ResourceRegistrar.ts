import { InstallationRepository } from "../repositories/InstallationRepository";
import { InstallationStatus } from "../models/Installation";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import { ResourceManifest } from "../models/ResourceManifest";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { isUpToDate } from "../utils/date";
import { urlDomain } from "../utils/url";

export class ResourceRegistrar {
  constructor(
    private preferencesRepository: PreferencesRepository,
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

    const {
      downloadUnsupportedDomains,
    } = await this.preferencesRepository.get();
    const status: InstallationStatus = downloadUnsupportedDomains.includes(
      urlDomain(resource.url)
    )
      ? "skipped"
      : "proposed";
    await this.installationRepository.create(resource.id, status);
    return;
  };
}
