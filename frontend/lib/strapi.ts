const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Timeout for fetch requests (15 seconds to avoid long build waits)
const FETCH_TIMEOUT = 15000;

/**
 * Generic fetch helper for Strapi REST API
 */
export async function fetchFromStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
      // Use revalidate for ISR (Incremental Static Regeneration)
      // Revalidate every 60 seconds in production, no cache in development
      next: { revalidate: process.env.NODE_ENV === "production" ? 60 : 0 },
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      const errorMessage = `Strapi fetch failed: ${res.status} ${res.statusText}${STRAPI_API_TOKEN ? '' : ' (No API token configured)'}`;
      console.error(errorMessage, {
        endpoint,
        status: res.status,
        statusText: res.statusText,
        hasToken: !!STRAPI_API_TOKEN,
        url: `${STRAPI_URL}/api${endpoint}`,
      });
      
      // For 404 errors, return null data instead of throwing
      // This allows the build to complete even if Strapi isn't ready
      if (res.status === 404) {
        console.warn(`Strapi endpoint not found (404): ${endpoint}. Returning null data.`);
        // Return null data - pages should handle this gracefully
        return { data: null } as T;
      }
      
      // For 502/503/504 errors (service unavailable/waking up), return null data
      // This allows builds to complete even when Strapi is spinning up
      if (res.status >= 500) {
        console.warn(`Strapi server error (${res.status}): ${endpoint}. Returning null data for build resilience.`);
        return { data: null } as T;
      }
      
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    // Handle network errors or fetch failures
    // During builds, return null data instead of failing
    const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
    const isTimeoutError = error instanceof Error && (
      error.message.includes('timeout') || 
      error.message.includes('ETIMEDOUT') ||
      error.message.includes('ECONNREFUSED')
    );
    
    if (isNetworkError || isTimeoutError) {
      console.warn(`Network/timeout error fetching ${endpoint}. Returning null data for build resilience.`, {
        endpoint,
        url: `${STRAPI_URL}/api${endpoint}`,
      });
      return { data: null } as T;
    }
    
    // For other errors during build, also return null data
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.warn(`Build-time fetch error for ${endpoint}. Returning null data.`, error);
      return { data: null } as T;
    }
    
    // Re-throw other errors in development
    throw error;
  }
}

/**
 * Get full URL for Strapi media
 */
export function getStrapiMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}
