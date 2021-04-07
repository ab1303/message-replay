export const queryString = (object: Record<string, string>): string => {
  return Object.keys(object)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
    .join('&');
};
