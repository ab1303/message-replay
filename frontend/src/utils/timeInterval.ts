export const toSeconds = (hhmmss: string): number => {
  if (!hhmmss) return 0;

  const intervals = hhmmss.split(':');

  const seconds = +intervals[0] * 60 * 60 + +intervals[1] * 60 + +intervals[2];
  return seconds;
};

export const toHHMMSS = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  let strHours, strMinutes, strSeconds;

  if (hours < 10) {
    strHours = '0' + hours;
  }
  if (minutes < 10) {
    strMinutes = '0' + minutes;
  }
  if (seconds < 10) {
    strSeconds = '0' + seconds;
  }
  return `${strHours}:${strMinutes}:${strSeconds}`;
};
