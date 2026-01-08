const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Generic fetch helper for Strapi REST API
 */
export async function fetchFromStrapi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    headers,
    cache: "no-store", // always fetch fresh content
    ...options,
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
}

/**
 * Get full URL for Strapi media
 */
export function getStrapiMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}
