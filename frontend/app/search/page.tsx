import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for announcements, news, and content on our website.",
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
};

function SearchResults({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResultsContent({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || "";

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-700 text-lg">Please enter a search query.</p>
      </div>
    );
  }

  let announcements: Announcement[] = [];
  
  try {
    const response = await fetchFromStrapi<AnnouncementsResponse>(
      `/announcements?populate=*&sort=Date:desc&filters[Published][$eq]=true`
    );
    
    announcements = response.data || [];
    
    // Transform flat data if needed
    if (announcements.length > 0 && !announcements[0].attributes) {
      announcements = announcements.map((ann: any) => ({
        id: ann.id,
        attributes: {
          Title: ann.Title,
          Slug: ann.Slug || `announcement-${ann.id}`,
          Date: ann.Date,
          Category: ann.Category,
          Image: ann.Image,
          Published: ann.Published,
        },
      })) as Announcement[];
    }

    // Filter by search query
    const searchLower = query.toLowerCase();
    announcements = announcements.filter((ann) => {
      const title = ann.attributes.Title?.toLowerCase() || "";
      const category = ann.attributes.Category?.toLowerCase() || "";
      return title.includes(searchLower) || category.includes(searchLower);
    });
  } catch (error) {
    console.error("Error searching announcements:", error);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--school-navy)" }}>
        Search Results for &quot;{query}&quot;
      </h2>
      
      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-700 text-lg">No results found for &quot;{query}&quot;.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => {
            const imageUrl = announcement.attributes.Image?.data?.attributes?.url
              ? getStrapiMediaUrl(announcement.attributes.Image.data.attributes.url)
              : null;
            const finalSlug = announcement.attributes.Slug || `announcement-${announcement.id}`;

            return (
              <Link
                key={announcement.id}
                href={`/announcements/${encodeURIComponent(finalSlug)}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
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
                  <h3
                    className="text-xl font-bold mb-2 line-clamp-2"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {announcement.attributes.Title}
                  </h3>
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
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }} role="main">
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title="Search"
          subtitle={query ? `Results for "${query}"` : "Find what you're looking for"}
        />
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Search", href: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}` },
            ]}
          />

          <SearchResults searchParams={searchParams} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
