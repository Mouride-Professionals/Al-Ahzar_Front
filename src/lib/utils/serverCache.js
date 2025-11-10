const cacheStore = new Map();

const hasExpired = (entry) => entry?.expiresAt && entry.expiresAt <= Date.now();

export const getCachedValue = (key) => {
  const entry = cacheStore.get(key);
  if (!entry) return undefined;
  if (hasExpired(entry)) {
    cacheStore.delete(key);
    return undefined;
  }
  return entry.value;
};

export const setCachedValue = (key, value, ttlMs) => {
  const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : undefined;
  cacheStore.set(key, { value, expiresAt });
};

export const deleteCachedValue = (key) => {
  cacheStore.delete(key);
};

export const clearCache = () => {
  cacheStore.clear();
};
