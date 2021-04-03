import { EventEmitterQueue } from "../adapters/Queue";
import { Resource } from "../models/Resource";

type Listener = (
  queued: Resource[],
  processing: Resource[],
  isActive: boolean
) => void;

export class ResourceInstallationWorker {
  private listeners: Listener[] = [];

  public start = () => {
    const queue = new EventEmitterQueue<Resource>(
      (entity, onProgress, onFinish) => {
        setTimeout(() => {
          onFinish();
        }, 5000);
      },
      {
        onChange: (queued, processing, isActive) => {
          console.log(
            `[${isActive ? "Active" : "Inactive"}] queued: `,
            queued,
            `processing: `,
            processing
          );

          this.listeners.forEach((listener) => {
            listener(Array.from(queued), Array.from(processing), isActive);
          });

          // 状態をウィンドウに通知して進捗を表示する
        },
      }
    );
    queue.start();

    return queue;
  };

  public addChangeListener = (listener: Listener) => {
    this.listeners.push(listener);
  };
}
