import {
  CrossDomainIdentifierFactory,
  IdentityFactory,
} from "../models/Identity";
import {
  DestinationNotFoundError,
  ManifestInvalidError,
  RequestError,
} from "../models/errors";
import { Installation, InstallationStatus } from "../models/Installation";

import AutoLaunch from "auto-launch";
import { BmsCheckRepository } from "../repositories/BmsCheckRepository";
import { BmsManifestRepository } from "../repositories/BmsManifestRepository";
import { BmsRegistrar } from "./BmsRegistrar";
import { BmsRepository } from "../repositories/BmsRepository";
import { GroupManifestRepository } from "../repositories/GroupManifestRepository";
import { GroupRegistrar } from "./GroupRegistrar";
import { GroupRepository } from "../repositories/GroupRepository";
import { InstallationRepository } from "../repositories/InstallationRepository";
import { InstallationWorker } from "../workers/InstallationWorker";
import { Lr2CustomFolderExporter } from "./CustomFolderExporter/Lr2CustomFolderExporter";
import { ObservationRegistrar } from "./ObservationRegistrar";
import { ObservationRepository } from "../repositories/ObservationRepository";
import { Preferences } from "../models/Preference";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import { ResourceRegistrar } from "./ResourceRegistrar";
import { ResourceRepository } from "../repositories/ResourceRepository";
import { ResourceSelector } from "./ResourceSelector";
import { UpdatesManifest } from "../models/UpdatesManifest";
import { UpdatesManifestRepository } from "../repositories/UpdatesManifestRepository";
import { isUpToDate } from "../utils/date";

type ErrorHandler = (title: string, err: Error) => void;

const emitEach = <T extends any[]>(
  handlers: ((...args: T) => void)[],
  ...args: T
) => {
  handlers.forEach((handler) => {
    handler(...args);
  });
};

export class Service {
  private errorListeners: ErrorHandler[] = [];

  constructor(
    private preferencesRepository: PreferencesRepository,
    private autoLaunch: AutoLaunch,
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

  public addErrorLister = (handler: ErrorHandler) => {
    this.errorListeners.push(handler);
  };

  public putInstallationIntoTaskQueue = async (installation: Installation) => {
    this.installationWorker.put(installation);
  };

  public skipInstallation = async (installation: Installation) => {
    this.installationRepoisotry.updateStatus(installation.id, "skipped");
  };

  public fetchPreferences = async () => {
    return await this.preferencesRepository.get();
  };
  public setPreferences = async (preferences: Preferences) => {
    await this.preferencesRepository.set(preferences);
    const autoLaunchEnabled = await this.autoLaunch.isEnabled();
    if (preferences.launchOnStartup) {
      if (!autoLaunchEnabled) {
        this.autoLaunch.enable();
      }
    } else {
      if (autoLaunchEnabled) {
        this.autoLaunch.disable();
      }
    }
  };

  public fetchInstallations = async (): Promise<Installation[]> => {
    // FIXME:
    // パフォーマンスに問題あり。方針を定める必要あり。
    // たぶんproposedとそれいがいのinstallationは別々に扱うべきかも。
    const LIMIT = 500;
    const installations = await this.installationRepoisotry.list(LIMIT);
    return installations;
  };

  public updateInstallationStatus = async (
    installationId: number,
    status: InstallationStatus
  ): Promise<void> => {
    await this.installationRepoisotry.updateStatus(installationId, status);
  };

  public importBmsManifest = async (
    manifestUrl: string
  ): Promise<Installation[]> => {
    const { identicalDomainsList } = await this.preferencesRepository.get();
    const cdIdentifierFactory = new CrossDomainIdentifierFactory(
      identicalDomainsList
    );
    const identityFactory = new IdentityFactory(cdIdentifierFactory);

    const bmsManifest = await this.bmsManifestRepository.fetch(manifestUrl);

    const bmsIdentity = identityFactory.create(
      {
        domain: bmsManifest.domain,
        domainScopedId: bmsManifest.domainScopedId,
      },
      bmsManifest.aliases
    );

    const bms = await this.bmsRegistrar.register(bmsManifest);

    await this.bmsRegistrar.updateChecked(bmsIdentity, new Date());

    for (const groupManifestUrl of bmsManifest.groupManifestUrls || []) {
      try {
        const groupManifest = await this.groupManifestRepository.fetch(
          groupManifestUrl
        );
        const group = await this.groupRegistrar.register(groupManifest, false);

        this.groupRepository.addBms(group.id, bms.id);
      } catch (err) {
        if (err instanceof RequestError) {
          emitEach(
            this.errorListeners,
            "グループマニフェストの読み込みに失敗しました",
            err
          );
        } else if (err instanceof ManifestInvalidError) {
          emitEach(
            this.errorListeners,
            "グループマニフェストの形式が正しくありませんでした",
            err
          );
        } else {
          emitEach(
            this.errorListeners,
            "グループマニフェストの登録に失敗しました",
            err
          );
        }
      }
    }

    if (bmsManifest.updatesManifestUrl) {
      await this.observationRegistrar.register(
        bmsManifest.updatesManifestUrl,
        new Date()
      );
    }

    const {
      coreResourceSelectionMethod,
      installsPatchResources,
      installsAdditionalResources,
      downloadUnsupportedDomains,
    } = await this.preferencesRepository.get();

    const resourceSelector = new ResourceSelector({
      coreResourceSelectionMethod,
      installsPatchResources,
      installsAdditionalResources,
      downloadUnsupportedDomains,
    });
    const resourcesToBeInstalled = resourceSelector.select(
      bmsManifest.resources
    );

    const createdInstallations: Installation[] = [];
    for (const toBeInstalled of resourcesToBeInstalled) {
      const created = await this.resourceRegistrar.register(
        toBeInstalled,
        bms.id
      );
      if (created) {
        createdInstallations.push(created);
      }
    }

    return createdInstallations;
  };

  public importGroupManifest = async (manifestUrl: string) => {
    const groupManifest = await this.groupManifestRepository.fetch(manifestUrl);

    await this.groupRegistrar.register(groupManifest, true);

    if (groupManifest.updatesManifestUrl) {
      await this.observationRegistrar.register(
        groupManifest.updatesManifestUrl,
        new Date()
      );
    }

    return groupManifest.bmses?.map((bms) => bms.manifestUrl) || [];
  };

  public checkUpdates = async () => {
    const observations = await this.observationRepository.list();

    const updatedBmsManifestUrlsList = await Promise.all(
      observations.map(async (observation) => {
        await this.observationRepository.markChecked(
          observation.manifestUrl,
          new Date()
        );

        let updates: UpdatesManifest;
        try {
          updates = await this.updatesManifestRepository.fetch(
            observation.manifestUrl
          );
        } catch (err) {
          if (err instanceof RequestError) {
            emitEach(
              this.errorListeners,
              "更新マニフェストを読み込めませんでした",
              err
            );
          } else if (err instanceof ManifestInvalidError) {
            emitEach(
              this.errorListeners,
              "更新マニフェストの形式が正しくありませんでした",
              err
            );
          } else {
            emitEach(
              this.errorListeners,
              "更新マニフェストを読み込めませんでした",
              err
            );
          }
          return null;
        }

        const manifestUrls = await Promise.all(
          (updates.bmses || []).map(async (updatedBms) => {
            const latestCheck = await this.bmsCheckRepository.fetch({
              domain: updatedBms.domain,
              domainScopedId: updatedBms.domainScopedId,
            });
            const shouldUpdate = latestCheck
              ? !isUpToDate(updatedBms.updatedAt, latestCheck.checkedAt)
              : false;

            let belongsToAutoAddingGroup = false;
            if (updatedBms.domainScopedGroupIds) {
              const corrGroups = await Promise.all(
                updatedBms.domainScopedGroupIds.map((domainScopedGroupId) => {
                  return this.groupRepository.fetch({
                    domain: updatedBms.domain,
                    domainScopedId: domainScopedGroupId,
                  });
                })
              );
              if (corrGroups.some((g) => g && g.autoDownloadNewBmses)) {
                belongsToAutoAddingGroup = true;
              }
            }

            if (shouldUpdate || belongsToAutoAddingGroup) {
              return updatedBms.manifestUrl;
            } else {
              return null;
            }
          })
        );

        return manifestUrls;
      })
    );

    const updatedBmsManifestUrls = updatedBmsManifestUrlsList
      .flat()
      .filter((v): v is string => !!v);

    return updatedBmsManifestUrls;
  };

  public exportLr2CustomFolders = async () => {
    const { lr2CustomFolderDist } = await this.preferencesRepository.get();

    if (!lr2CustomFolderDist) {
      throw new DestinationNotFoundError(
        "カスタムフォルダの出力先がありません"
      );
    }

    const groups = await this.groupRepository.all();
    const groupBmsList = await Promise.all(
      groups.map(async (group) => {
        const bmses = await this.bmsRepository.listForGroup(group.id);
        return {
          group,
          bmses,
        };
      })
    );

    const c = new Lr2CustomFolderExporter(lr2CustomFolderDist, groupBmsList);
    await c.clean();
    await c.export();
  };
}
