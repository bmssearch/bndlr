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
