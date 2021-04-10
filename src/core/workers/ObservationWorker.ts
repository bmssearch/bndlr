import { ObservationRepository } from "../repositories/ObservationRepository";
import { PreferencesRepository } from "../repositories/PreferencesRepository";
import { isOverInterval } from "../utils/date";

const OBSERVATION_CHECK_INTERVAL_MIN = 1;

export class ObservationWorker {
  private timer?: NodeJS.Timeout;
  private onDetectUpdate: (() => void)[] = [];

  constructor(
    private preferencesRepository: PreferencesRepository,
    private observationRepository: ObservationRepository
  ) {}

  public start = () => {
    this.timer = setInterval(async () => {
      const now = new Date();

      const { observationIntervalMin } = await this.preferencesRepository.get();

      const observations = await this.observationRepository.list();
      if (
        observations.some((o) =>
          isOverInterval(o.checkedAt, now, observationIntervalMin * 60)
        )
      ) {
        this.onDetectUpdate.forEach((v) => v());
      }
    }, OBSERVATION_CHECK_INTERVAL_MIN * 60 * 1000);
  };

  public close = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  public addDetectUpdateListener = (handler: () => void) => {
    this.onDetectUpdate.push(handler);
  };
}
