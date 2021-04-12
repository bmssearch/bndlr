export interface DownloadResult {
  filePath: string;
}

interface ConnectionProgress {
  type: "connecting";
}
interface TransferProgress {
  type: "transfer";
  transferedByte: number;
  totalByte?: number;
}
export type Progress = ConnectionProgress | TransferProgress;

export type ProgressHandler = (progress: Progress) => void;
