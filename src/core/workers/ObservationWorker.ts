import { DateTime } from "luxon";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import schedule from "node-schedule";

export class ObservationWorker {
  private job?: schedule.Job;
  private onDetectUpdate: (() => void)[] = [];

  constructor(private preferencesRepository: PreferencesRepository) {}

  public start = () => {
    const handler = async () => {
      this.onDetectUpdate.forEach((v) => v());

      const { observationIntervalMin } = await this.preferencesRepository.get();
      const intervalMin = Math.max(observationIntervalMin, 1);
      const next = DateTime.local().plus({ minute: intervalMin }).toJSDate();
      this.job = schedule.scheduleJob(next, handler);
    };

    handler();
  };

  public close = () => {
    if (this.job) {
      this.job.cancel();
    }
  };

  public addDetectUpdateListener = (handler: () => void) => {
    this.onDetectUpdate.push(handler);
  };
}
