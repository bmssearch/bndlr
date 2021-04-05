import { EventEmitter } from "events";

export interface QueueItem<T, P> {
  entity: T;
  status: "queued" | "processing";
  progress?: P;
}

type Handler<T, P> = (
  entity: T,
  onProgress: (progress: P) => void,
  onFinish: () => void
) => void;

type ChangeListener<T, M> = (
  items: QueueItem<T, M>[],
  isActive: boolean
) => void;

interface EventEmitterQueueConifg {
  maxParallelProcess?: number;
}

export interface Queue<T, P> {
  init: (handler: Handler<T, P>, config?: EventEmitterQueueConifg) => void;
  addChangeListener: (onChnage: ChangeListener<T, P>) => void;
  put: (entity: T) => void;
  start: () => void;
  pause: () => void;
}

export class EventEmitterQueue<T, M> implements Queue<T, M> {
  private items: Set<QueueItem<T, M>> = new Set<QueueItem<T, M>>();
  private isActive = false;
  private eventEmitter: EventEmitter = new EventEmitter();

  private handler?: Handler<T, M>;
  private maxParallelProcess?: number;

  private changeListeners: ChangeListener<T, M>[] = [];

  public init = (handler: Handler<T, M>, config?: EventEmitterQueueConifg) => {
    this.handler = handler;
    this.maxParallelProcess =
      config?.maxParallelProcess !== undefined ? config.maxParallelProcess : 1;
  };

  public put = (entity: T, metadata?: M) => {
    this.items.add({ entity, status: "queued", progress: metadata });
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

  public addChangeListener = (changeHandler: ChangeListener<T, M>) => {
    this.changeListeners.push(changeHandler);
  };

  private handle = async () => {
    const queued = Array.from(this.items).filter((v) => v.status === "queued");
    const processing = Array.from(this.items).filter(
      (v) => v.status === "processing"
    );

    if (
      this.isActive &&
      queued.length > 0 &&
      processing.length < (this.maxParallelProcess || 1)
    ) {
      const item = queued[0];
      item.status = "processing";

      this.onChange();

      if (this.handler) {
        this.handler(
          item.entity,
          (progress) => {
            item.progress = progress;
            this.onChange();
          },
          () => {
            this.items.delete(item);
            this.onChange();
            this.eventEmitter.emit("finish");
          }
        );
      }
    }
  };

  private onChange = () => {
    this.changeListeners.forEach((listener) => {
      listener(Array.from(this.items), this.isActive);
    });
  };
}
