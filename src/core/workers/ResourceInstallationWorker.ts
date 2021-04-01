import { EventEmitterQueue } from "../adapters/Queue";
import { Resource } from "../models/Resource";

export class ResourceInstallationWorker {
  public start = (
    onChange?: (
      queued: Resource[],
      processing: Resource[],
      isActive: boolean
    ) => void
  ) => {
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

          if (onChange) {
            onChange(Array.from(queued), Array.from(processing), isActive);
          }

          // 状態をウィンドウに通知して進捗を表示する
        },
      }
    );
    queue.start();

    return queue;
  };
}
