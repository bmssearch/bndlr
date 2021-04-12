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
export type ResourceInstallerProgress =
  | ConnectingProgress
  | TransferringProgress
  | ExtractingProgress
  | CopyingProgress
  | CleaningProgress;

export type ProgressHandler = (progress: ResourceInstallerProgress) => void;
