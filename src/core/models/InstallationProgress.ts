interface QueuedProgress {
  type: "queued";
}
interface ConnectingProgress {
  type: "connecting";
}
interface TransferringProgress {
  type: "transferring";
  transferedByte: number;
  totalByte?: number;
}
interface ExtractingProgress {
  type: "extracting";
}
interface CopyingProgress {
  type: "copying";
}
interface CleaningProgress {
  type: "cleaning";
}
export type InstallationProgressProgress =
  | QueuedProgress
  | ConnectingProgress
  | TransferringProgress
  | ExtractingProgress
  | CopyingProgress
  | CleaningProgress;

export interface InstallationProgressAttrs {
  installationId: number;
  progress?: InstallationProgressProgress;
}

export class InstallationProgress implements InstallationProgressAttrs {
  public installationId: number;
  public progress?: InstallationProgressProgress;

  constructor(attrs: InstallationProgressAttrs) {
    this.installationId = attrs.installationId;
    this.progress = attrs.progress;
  }
}
