import {
  CrossDomainIdentifierFactory,
  IdentityFactory,
} from "../models/Identity";
import { Installation, InstallationStatus } from "../models/Installation";

import { BmsCheckRepository } from "../repositories/BmsCheckRepository";
import { BmsManifestRepository } from "../repositories/BmsManifestRepository";
import { BmsRegistrar } from "./BmsRegistrar";
import { BmsRepository } from "../repositories/BmsRepository";
import { GroupManifestRepository } from "../repositories/GroupManifestRepository";
import { GroupRegistrar } from "./GroupRegistrar";
import { GroupRepository } from "../repositories/GroupRepository";
import { InstallationRepository } from "../repositories/InstallationRepository";
import { InstallationWorker } from "../workers/InstallationWorker";
import { ObservationRegistrar } from "./ObservationRegistrar";
import { ObservationRepository } from "../repositories/ObservationRepository";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import { ResourceRegistrar } from "./ResourceRegistrar";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { ResourceSelector } from "./ResourceSelector";
import { UpdatesManifestRepository } from "../repositories/UpdatesManifestRepository";
import { isUpToDate } from "../utils/date";

export class Service {
  constructor(
    private preferencesRepository: PreferencesRepository,
    private installationWorker: InstallationWorker,

    private bmsManifestRepository: BmsManifestRepository,
    private groupManifestRepository: GroupManifestRepository,
    private updatesManifestRepository: UpdatesManifestRepository,

    private bmsRepository: BmsRepository,
    private bmsCheckRepository: BmsCheckRepository,
    private groupRepository: GroupRepository,
    private observationRepository: ObservationRepository,
    private resourceRepoisotry: ResourceRepository,
    private installationRepoisotry: InstallationRepository,

    private bmsRegistrar: BmsRegistrar,
    private groupRegistrar: GroupRegistrar,
    private observationRegistrar: ObservationRegistrar,
    private resourceRegistrar: ResourceRegistrar
  ) {}

  public putInstallationIntoTaskQueue = async (installation: Installation) => {
    // InstallationProgressを生成
    this.installationWorker.put(installation);
  };

  public fetchInstallations = async (): Promise<Installation[]> => {
    const installations = await this.installationRepoisotry.list();
    return installations;
  };

  public updateInstallationStatus = async (
    installationId: number,
    status: InstallationStatus
  ): Promise<void> => {
    await this.installationRepoisotry.updateStatus(installationId, status);
  };

  public addBms = async (manifestUrl: string): Promise<void> => {
    const bmsManifest = await this.bmsManifestRepository.fetch(manifestUrl);
    const bmsIdentity = createIdentity(
      bmsManifest.domain,
      bmsManifest.domainScopedId
    );

    const bms = await this.bmsRegistrar.register(bmsManifest);

    await this.bmsRegistrar.updateChecked(bmsIdentity, new Date());

    if (bmsManifest.groupManifestUrl) {
      const groupManifest = await this.groupManifestRepository.fetch(
        bmsManifest.groupManifestUrl
      );
      await this.groupRegistrar.register(groupManifest);
    }

    if (bmsManifest.updatesManifestUrl) {
      await this.observationRegistrar.register(
        bmsManifest.updatesManifestUrl,
        new Date()
      );
    }

    const {
      resourcePreferences: resourcePreference,
    } = await this.preferencesRepository.get();
    const resourceSelector = new ResourceSelector({ ...resourcePreference });
    const resourcesToBeInstalled = resourceSelector.select(
      bmsManifest.resources
    );

    for (const toBeInstalled of resourcesToBeInstalled) {
      await this.resourceRegistrar.register(toBeInstalled, bms.id);
    }
    return;
  };

  public addGroup = async (manifestUrl: string) => {
    const groupManifest = await this.groupManifestRepository.fetch(manifestUrl);

    await this.groupRegistrar.register(groupManifest);

    if (groupManifest.updatesManifestUrl) {
      await this.observationRegistrar.register(
        groupManifest.updatesManifestUrl,
        new Date()
      );
    }

    if (groupManifest.bmses) {
      for (const b of groupManifest.bmses) {
        await this.addBms(b.manifestUrl);
      }
    }
  };

  public checkUpdates = async () => {
    const observations = await this.observationRepository.list();
    for (const observation of observations) {
      const updates = await this.updatesManifestRepository.fetch(
        observation.manifestUrl
      );

      await this.observationRepository.check(
        observation.manifestUrl,
        new Date()
      );

      if (!updates.bmses) continue;
      for (const updatedBms of updates.bmses) {
        const latestCheck = await this.bmsCheckRepository.fetch({
          domain: updatedBms.domain,
          domainScopedId: updatedBms.domainScopedId,
        });
        const shouldUpdate = latestCheck
          ? !isUpToDate(updatedBms.updatedAt, latestCheck.checkedAt)
          : false;

        let belongsToAutoAddingGroup = false;
        if (updatedBms.domainScopedGroupId) {
          const corrGroup = await this.groupRepository.fetch({
            domain: updatedBms.domain,
            domainScopedId: updatedBms.domainScopedGroupId,
          });
          if (corrGroup && corrGroup.autoDownloadNewBmses) {
            belongsToAutoAddingGroup = true;
          }
        }

        if (shouldUpdate || belongsToAutoAddingGroup) {
          await this.addBms(updatedBms.manifestUrl);
        }
      }
    }
  };
}

const createIdentity = (domain: string, domainScopedId: string) => {
  const cdIdentifierFactory = new CrossDomainIdentifierFactory([
    ["bmssearch.net", "venue.bmssearch.net", "ringo.com"],
  ]);
  const identityFactory = new IdentityFactory(cdIdentifierFactory);

  const identity = identityFactory.create(
    {
      domain: domain,
      domainScopedId: domainScopedId,
    },
    [{ domain: "ringo.com", domainScopedId: "didid" }]
  );

  return identity;
};
