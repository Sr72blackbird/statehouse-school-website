import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const allResponse = await fetchFromStrapi<AnnouncementResponse>(
      `/announcements?populate=*&sort=Date:desc`
    );

    const found = allResponse.data?.find((ann: any) => {
      const existingSlug = ann.attributes?.Slug || ann.attributes?.slug || ann.Slug || ann.slug;
      const title = ann.attributes?.Title || ann.Title;
      
      if (existingSlug && existingSlug !== 'null' && existingSlug === decodedSlug) {
        return true;
      }
      
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
      const title = found.attributes?.Title || (found as any).Title;
      return {
        title: title || "Announcement",
        description: `Read the full announcement: ${title}`,
        openGraph: {
          title: title || "Announcement",
          description: `Read the full announcement: ${title}`,
        },
      };
    }
  } catch {
    // Fall through to default
  }

  return {
    title: "Announcement",
    description: "Read our latest announcement",
  };
}

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
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title={announcement.attributes.Title}
          subtitle={announcement.attributes.Category || undefined}
          backgroundImage={imageUrl || undefined}
        />
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-slate-600 hover:text-slate-900 text-sm sm:text-base transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Announcements
          </Link>

          {announcement.attributes.Date && (
            <p className="text-slate-600 mb-6 text-sm">
              Published on{" "}
              {new Date(announcement.attributes.Date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {announcement.attributes.Content && (
            <div className="prose prose-lg max-w-none">
              {renderBlocks(announcement.attributes.Content)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
