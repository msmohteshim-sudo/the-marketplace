export const safeJsonParse = <T,>(val: any, fallback: T): T => {
  if (val === null || val === undefined) return fallback;
  if (typeof val !== 'string') return val as T;
  const trimmed = val.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    if (Array.isArray(fallback)) {
      return [trimmed] as unknown as T;
    }
    return fallback;
  }
};
