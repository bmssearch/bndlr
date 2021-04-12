import { DownloadUrlModifier } from ".";
import { URL } from "url";

export class DropboxDownloadUrlModifier implements DownloadUrlModifier {
  public modify = (downloadUrl: string) => {
    const url = new URL(downloadUrl);

    if (url.hostname !== "www.dropbox.com") {
      return downloadUrl;
    }

    url.searchParams.delete("dl");
    url.searchParams.append("dl", "1");
    return url.href;
  };
}
