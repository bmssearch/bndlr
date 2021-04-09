import { DateTime } from "luxon";

export const isUpToDate = (
  latest: Date | undefined,
  current: Date | undefined
): boolean => {
  if (current === undefined) {
    return false;
  } else if (latest === undefined) {
    return true;
  } else {
    return latest <= current;
  }
};

export const isOverInterval = (from: Date, now: Date, intervalSec: number) => {
  return (
    DateTime.fromJSDate(from).plus({ seconds: intervalSec }) <
    DateTime.fromJSDate(now)
  );
};
