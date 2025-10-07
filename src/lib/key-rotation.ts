/**
 * API Key Rotation Utility
 * 
 * Distributes API requests across multiple keys to prevent rate limiting.
 * Each service can have multiple keys that are rotated automatically.
 */

// Google Search API Keys (for all search endpoints)
const GOOGLE_KEYS = [
  process.env.GOOGLE_SEARCH_API_KEY,
  process.env.GOOGLE_SEARCH_API_KEY_1,
  process.env.GOOGLE_SEARCH_API_KEY_2,
  process.env.GOOGLE_SEARCH_API_KEY_3,
].filter(Boolean) as string[];

// Style Search IDs (for style-specific searches)
const STYLE_KEYS = [
  process.env.STYLE_SEARCH_ID,
  process.env.STYLE_SEARCH_ID_1,
  process.env.STYLE_SEARCH_ID_2,
].filter(Boolean) as string[];

// Garment Search IDs (for garment-specific searches)
const GARMENT_KEYS = [
  process.env.GARMENT_SEARCH_ID,
  process.env.GARMENT_SEARCH_ID_1,
  process.env.GARMENT_SEARCH_ID_2,
].filter(Boolean) as string[];

/**
 * Get a rotated Google Search API key
 * Uses time-based rotation to distribute load evenly
 */
export function getGoogleSearchKey(): string {
  if (GOOGLE_KEYS.length === 0) {
    throw new Error('No Google Search API keys configured');
  }
  
  // Use timestamp-based rotation for consistent distribution
  const index = Math.floor(Date.now() / 1000 / 60) % GOOGLE_KEYS.length;
  return GOOGLE_KEYS[index];
}

/**
 * Get a rotated Style Search ID
 * Uses random rotation for better load distribution
 */
export function getStyleSearchId(): string {
  if (STYLE_KEYS.length === 0) {
    throw new Error('No Style Search IDs configured');
  }
  
  // Random rotation
  const index = Math.floor(Math.random() * STYLE_KEYS.length);
  return STYLE_KEYS[index];
}

/**
 * Get a rotated Garment Search ID
 * Uses minute-based rotation for predictable distribution
 */
export function getGarmentSearchId(): string {
  if (GARMENT_KEYS.length === 0) {
    throw new Error('No Garment Search IDs configured');
  }
  
  // Minute-based rotation
  const index = new Date().getMinutes() % GARMENT_KEYS.length;
  return GARMENT_KEYS[index];
}

/**
 * Get key pool statistics for monitoring
 */
export function getKeyPoolStats() {
  return {
    google: {
      total: GOOGLE_KEYS.length,
      available: GOOGLE_KEYS.length > 0,
    },
    style: {
      total: STYLE_KEYS.length,
      available: STYLE_KEYS.length > 0,
    },
    garment: {
      total: GARMENT_KEYS.length,
      available: GARMENT_KEYS.length > 0,
    },
  };
}

/**
 * Log key rotation info for debugging
 */
export function logKeyRotation(service: 'google' | 'style' | 'garment', keyIndex: string) {
  const stats = getKeyPoolStats();
  console.log(`[Key Rotation] ${service.toUpperCase()} - Using key ${keyIndex}/${stats[service].total}`);
}
