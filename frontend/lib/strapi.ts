const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

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

  try {
    const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      ...options,
      headers,
      // Use revalidate for ISR (Incremental Static Regeneration)
      // Revalidate every 60 seconds in production, no cache in development
      next: { revalidate: process.env.NODE_ENV === "production" ? 60 : 0 },
    });

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
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    // Handle network errors or fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const errorMessage = `Network error: Unable to connect to Strapi at ${STRAPI_URL}. Please ensure Strapi is running.`;
      console.error(errorMessage, {
        endpoint,
        url: `${STRAPI_URL}/api${endpoint}`,
        originalError: error,
      });
      throw new Error(errorMessage);
    }
    // Re-throw other errors
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
