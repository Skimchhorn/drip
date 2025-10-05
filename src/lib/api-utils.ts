// src/lib/api-utils.ts
export function requireQueryParam(url: URL, key: string): string {
  const val = url.searchParams.get(key);
  if (!val || !val.trim()) {
    throw new Error(`Missing required query param: ${key}`);
  }
  return val.trim();
}

export function isValidUrl(s: string) {
  try { new URL(s); return true; } catch { return false; }
}