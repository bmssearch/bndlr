import { DBObservation } from "../../adapters/sequelize/models/DBObservation";
import { ObservationRepository } from "../ObservationRepository";

// sqlite3 は electron forge でうまくコンパイルできずに死んだ。
// better-sqlite3なら何とかなりそうだが、sequelizeと互換性がない。
// かくしてsequelizeの実装はすべて無に帰すのだった

export class SequelizeObservationRepository implements ObservationRepository {
  public list = async () => {
    const observations = await DBObservation.findAll();
    return observations.map((v) => v.toObservation());
  };

  public check = async (manifestUrl: string, checkedAt: Date) => {
    await DBObservation.update({ checkedAt }, { where: { manifestUrl } });
  };

  public createOrIgnore = async (
    updatesManifestUrl: string,
    checkedAt: Date
  ) => {
    await DBObservation.findOrCreate({
      where: { manifestUrl: updatesManifestUrl },
      defaults: {
        manifestUrl: updatesManifestUrl,
        checkedAt,
      },
    });
  };
}
