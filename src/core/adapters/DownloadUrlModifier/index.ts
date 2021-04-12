export interface DownloadUrlModifier {
  modify: (url: string) => string;
}
