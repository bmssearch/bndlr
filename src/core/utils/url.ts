import { URL } from "url";

export const urlDomain = (url: string): string => {
  const u = new URL(url);
  return u.hostname;
};
