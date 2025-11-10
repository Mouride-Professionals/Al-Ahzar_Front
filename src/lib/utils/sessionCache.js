// Client-side session cache to prevent excessive /api/auth/session calls
let sessionCache = null;
let cacheTimestamp = 0;
let sessionPromise = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

export const getCachedSession = async (getSessionFn) => {
  const now = Date.now();

  // Return cached session if still valid
  if (sessionCache && now - cacheTimestamp < CACHE_DURATION) {
    return sessionCache;
  }

  // Reuse in-flight request if available
  if (sessionPromise) {
    return sessionPromise;
  }

  // Fetch fresh session
  sessionPromise = getSessionFn()
    .then((session) => {
      sessionCache = session;
      cacheTimestamp = Date.now();
      return session;
    })
    .catch((error) => {
      sessionCache = null;
      cacheTimestamp = 0;
      throw error;
    })
    .finally(() => {
      sessionPromise = null;
    });

  return sessionPromise;
};

export const clearSessionCache = () => {
  sessionCache = null;
  cacheTimestamp = 0;
  sessionPromise = null;
};
