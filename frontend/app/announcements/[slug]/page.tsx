import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

type Block = {
  type: string;
  children?: Array<{ type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  level?: number;
  format?: string;
};

type Media = {
  url: string;
};

type Announcement = {
  id: number;
  attributes: {
    Title: string;
    Slug: string;
    Content: Block[] | null;
    Date: string | null;
    Category: "News" | "Notice" | "Event" | null;
    Image: { data: { attributes: Media } | null } | null;
    Published: boolean;
  };
};

type AnnouncementResponse = {
  data: Announcement[];
};

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // URL decode the slug in case it was encoded
  const decodedSlug = decodeURIComponent(slug);
  
  // Handle "null" string case
  if (decodedSlug === 'null' || !decodedSlug) {
    notFound();
  }
  
  // Check if slug is actually an ID (starts with "announcement-")
  let response: AnnouncementResponse;
  
  try {
    if (decodedSlug.startsWith('announcement-')) {
      const id = decodedSlug.replace('announcement-', '');
      response = await fetchFromStrapi<AnnouncementResponse>(
        `/announcements/${id}?populate=*`
      );
      // Wrap single result in array format
      if (response && (response as any).data && !Array.isArray((response as any).data)) {
        response = { data: [(response as any).data] };
      }
    } else {
      // Fetch all announcements and filter in code (more reliable with flat structure)
      const allResponse = await fetchFromStrapi<AnnouncementResponse>(
        `/announcements?populate=*&sort=Date:desc`
      );
      
      if (allResponse.data) {
        // Find by slug in flat or nested structure, and also try matching generated slug from title
        const found = allResponse.data.find((ann: any) => {
          // Get slug from various possible locations
          const slug = ann.attributes?.Slug || ann.attributes?.slug || ann.Slug || ann.slug;
          const title = ann.attributes?.Title || ann.Title;
          const published = ann.attributes?.Published ?? ann.Published;
          
          // Skip if not published
          if (published !== true) {
            return false;
          }
          
          // Check if slug matches
          if (slug && slug === decodedSlug) {
            return true;
          }
          
          // Always try generating slug from title and matching (since slug might be null/undefined)
          if (title) {
            const generatedSlug = title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            if (generatedSlug === decodedSlug) {
              return true;
            }
          }
          
          return false;
        });
        
        if (found) {
          response = { data: [found] };
        } else {
          response = { data: [] };
        }
      } else {
        response = { data: [] };
      }
    }
  } catch (error) {
    console.error("Error fetching announcement:", error);
    notFound();
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("Looking for slug:", decodedSlug);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    if (response.data && response.data.length > 0) {
      console.log("First result:", JSON.stringify(response.data[0], null, 2));
    }
  }

  if (!response.data || response.data.length === 0) {
    notFound();
  }

  let announcement = response.data[0];

  // Check if data structure is flat (like admission requirements)
  if (!announcement.attributes) {
    // Data is flat, need to transform it
    announcement = {
      id: (announcement as any).id,
      attributes: {
        Title: (announcement as any).Title,
        Slug: (announcement as any).Slug,
        Content: (announcement as any).Content,
        Date: (announcement as any).Date,
        Category: (announcement as any).Category,
        Image: (announcement as any).Image,
        Published: (announcement as any).Published,
      },
    } as Announcement;
  }

  const imageUrl = announcement.attributes.Image?.data?.attributes?.url
    ? getStrapiMediaUrl(announcement.attributes.Image.data.attributes.url)
    : null;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      <section className="max-w-4xl mx-auto py-16 px-6">
        <Link
          href="/announcements"
          className="inline-block mb-8 text-slate-600 hover:text-slate-900"
        >
          ← Back to Announcements
        </Link>

        {announcement.attributes.Category && (
          <span
            className="inline-block px-4 py-2 text-sm font-semibold rounded-full mb-4"
            style={{
              backgroundColor: "var(--school-sky)",
              color: "var(--school-navy)",
            }}
          >
            {announcement.attributes.Category}
          </span>
        )}

        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--school-navy)" }}
        >
          {announcement.attributes.Title}
        </h1>

        {announcement.attributes.Date && (
          <p className="text-slate-600 mb-8">
            {new Date(announcement.attributes.Date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {imageUrl && (
          <div className="mb-8">
            <img
              src={imageUrl}
              alt={announcement.attributes.Title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {announcement.attributes.Content && (
          <div className="prose prose-lg max-w-none">
            {renderBlocks(announcement.attributes.Content)}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
