// Ignore string error by this helper
export const routeTo = (
  path: string,
  params: Record<string, string> = {},
): string =>
  Object.entries(params).reduce(
    // @ts-ignore
    (accumulator, [key, value]) => accumulator.replace(`:${key}`, value),
    path,
  );
