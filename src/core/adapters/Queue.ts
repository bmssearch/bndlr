import { EventEmitter } from "events";

export interface Queue<T> {
  put: (entity: T) => void;
  start: () => void;
  pause: () => void;
}

interface EventEmitterQueueConifg<T> {
  maxParallelProcess?: number;
  onChange?: (queued: Set<T>, processing: Set<T>, isActive: boolean) => void;
}

export class EventEmitterQueue<T> implements Queue<T> {
  private queued: Set<T>;
  private processing: Set<T>;
  private isActive: boolean;
  private eventEmitter: EventEmitter;
  private maxParallelProcess: number;
  private rawOnChange?: (
    queued: Set<T>,
    processing: Set<T>,
    isActive: boolean
  ) => void;

  constructor(
    private handler: (
      entity: T,
      onProgress: () => void,
      onFinish: () => void
    ) => void,
    config?: EventEmitterQueueConifg<T>
  ) {
    this.queued = new Set<T>();
    this.processing = new Set<T>();
    this.isActive = false;
    this.eventEmitter = new EventEmitter();
    this.maxParallelProcess =
      config?.maxParallelProcess !== undefined ? config.maxParallelProcess : 1;
    this.rawOnChange = config?.onChange;
  }

  public put = (entity: T) => {
    this.queued.add(entity);
    this.onChange();

    this.eventEmitter.emit("put");
  };

  public start = () => {
    this.isActive = true;
    this.onChange();

    this.eventEmitter.on("put", this.handle);
    this.eventEmitter.on("finish", this.handle);
    this.handle();
  };

  public pause = () => {
    this.isActive = false;
    this.onChange();

    this.eventEmitter.removeListener("put", this.handle);
    this.eventEmitter.removeListener("finish", this.handle);
  };

  private handle = async () => {
    if (
      this.isActive &&
      this.queued.size > 0 &&
      this.processing.size < this.maxParallelProcess
    ) {
      const entity = this.queued.values().next().value as T;
      this.queued.delete(entity);
      this.processing.add(entity);
      this.onChange();

      this.handler(
        entity,
        () => {
          console.log("progress");
        },
        () => {
          this.processing.delete(entity);
          this.onChange();

          this.eventEmitter.emit("finish");
        }
      );
    }
  };

  private onChange = () => {
    if (this.rawOnChange) {
      this.rawOnChange(this.queued, this.processing, this.isActive);
    }
  };
}
