export interface DirectoryLocator {
  copy: (src: string, dest: string) => Promise<void>;
}
