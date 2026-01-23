import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Announcements",
  description: "Stay updated with the latest news, notices, and events from our school.",
  openGraph: {
    title: "Announcements - Statehouse School",
    description: "Stay updated with the latest news, notices, and events.",
  },
};

type Media = {
  url: string;
};

type Announcement = {
  id: number;
  attributes: {
    Title: string;
    Slug: string;
    Date: string | null;
    Category: "News" | "Notice" | "Event" | null;
    Image: { data: { attributes: Media } | null } | null;
    Published: boolean;
  };
};

type AnnouncementsResponse = {
  data: Announcement[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export default async function AnnouncementsPage() {
  let response: AnnouncementsResponse;
  
  try {
    response = await fetchFromStrapi<AnnouncementsResponse>(
      "/announcements?populate=*&sort=Date:desc&filters[Published][$eq]=true"
    );
  } catch (error) {
    console.error("Error fetching announcements:", error);
    response = { 
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 0,
          pageCount: 0,
          total: 0,
        },
      },
    };
  }

  let announcements = response.data || [];

  // Debug logging in development
  if (process.env.NODE_ENV === "development" && announcements.length > 0) {
    const firstAnn = announcements[0] as any;
    console.log("First announcement raw:", JSON.stringify(firstAnn, null, 2));
    console.log("Has attributes?", !!firstAnn.attributes);
    console.log("Slug field:", firstAnn.Slug || firstAnn.slug || firstAnn.attributes?.Slug || firstAnn.attributes?.slug);
  }

  // Check if data structure is flat (like admission requirements)
  if (announcements.length > 0 && !announcements[0].attributes) {
    // Data is flat, need to transform it
    announcements = announcements.map((ann: any) => {
      // Generate slug from title if slug is null/empty/undefined or the string "null"
      let slug = ann.Slug || ann.slug; // Try both cases
      // Check if slug is null, undefined, empty, or the string "null"
      if (!slug || slug === 'null' || slug === 'undefined') {
        if (ann.Title) {
          slug = ann.Title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        } else {
          slug = `announcement-${ann.id}`;
        }
      }
      
      // Always ensure we have a slug, use ID as fallback
      if (!slug || slug === 'null' || slug === 'undefined') {
        slug = `announcement-${ann.id}`;
      }
      
      return {
        id: ann.id,
        attributes: {
          Title: ann.Title,
          Slug: slug,
          Date: ann.Date,
          Category: ann.Category,
          Image: ann.Image,
          Published: ann.Published,
        },
      };
    }) as Announcement[];
  } else if (announcements.length > 0) {
    // Even if nested, check if slug is null and generate one
    announcements = announcements.map((ann: any) => {
      const currentSlug = ann.attributes?.Slug || ann.attributes?.slug;
      // Check if slug is null, undefined, empty, or the string "null"
      if (!currentSlug || currentSlug === 'null' || currentSlug === 'undefined') {
        let slug: string;
        if (ann.attributes?.Title) {
          slug = ann.attributes.Title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        } else {
          slug = `announcement-${ann.id}`;
        }
        ann.attributes.Slug = slug;
      }
      return ann;
    });
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title="Announcements"
          subtitle="Stay updated with the latest news, notices, and events"
        />
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-700 text-base sm:text-lg">No announcements at this time.</p>
            </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {announcements
              .filter((announcement) => {
                // Filter out announcements without valid data
                return announcement && announcement.id && announcement.attributes;
              })
              .map((announcement) => {
              const imageUrl = announcement.attributes.Image?.data?.attributes?.url
                ? getStrapiMediaUrl(announcement.attributes.Image.data.attributes.url)
                : null;

              // Ensure slug exists, use ID as fallback
              let slug = announcement.attributes.Slug;
              
              // If slug is null/undefined/empty, generate from title or use ID
              if (!slug || slug === 'null' || slug === 'undefined') {
                if (announcement.attributes.Title) {
                  slug = announcement.attributes.Title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                } else {
                  slug = `announcement-${announcement.id}`;
                }
                
                if (process.env.NODE_ENV === "development") {
                  console.warn("Announcement missing slug, generated:", slug, "for announcement:", announcement.id);
                }
              }
              
              // Final safety check - if still no slug, use ID
              if (!slug) {
                slug = `announcement-${announcement.id}`;
              }

              return (
                <Link
                  key={announcement.id}
                  href={`/announcements/${encodeURIComponent(slug)}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${announcement.attributes.Title}${announcement.attributes.Category ? ` - ${announcement.attributes.Category}` : ''}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {announcement.attributes.Category && (
                      <span
                        className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2"
                        style={{
                          backgroundColor: "var(--school-sky)",
                          color: "var(--school-navy)",
                        }}
                      >
                        {announcement.attributes.Category}
                      </span>
                    )}
                    <h2
                      className="text-xl font-bold mb-2 line-clamp-2"
                      style={{ color: "var(--school-navy)" }}
                    >
                      {announcement.attributes.Title}
                    </h2>
                    {announcement.attributes.Date && (
                      <p className="text-sm text-slate-600">
                        {new Date(announcement.attributes.Date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
