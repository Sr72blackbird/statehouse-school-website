import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

type Media = {
  url: string;
};

type AboutSchool = {
  School_name: string;
  history: string | null;
  mission: string | null;
  vision: string | null;
  core_values: string | null;
  established_year: string | null;
  logo: Media | null;
  profile_image: Media | null;
  location?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  google_maps_embed_url?: string | null;
};

type AboutSchoolResponse = {
  data: AboutSchool;
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

type GalleryAlbum = {
  id: number;
  attributes: {
    title: string;
    cover_image: { data: { attributes: Media } | null } | null;
  };
};

type GalleryAlbumsResponse = {
  data: GalleryAlbum[];
};

export default async function Home() {
  // Fetch all data in parallel with error handling
  let about: AboutSchoolResponse | null = null;
  let announcementsResponse: AnnouncementsResponse | null = null;
  let galleryResponse: GalleryAlbumsResponse | null = null;

  try {
    [about, announcementsResponse, galleryResponse] = await Promise.all([
      fetchFromStrapi<AboutSchoolResponse>("/about-the-school?populate=*").catch((error) => {
        console.error("Error fetching about school:", error);
        return null;
      }),
      fetchFromStrapi<AnnouncementsResponse>(
        "/announcements?populate=*&sort=Date:desc&filters[Published][$eq]=true&pagination[limit]=3"
      ).catch((error) => {
        console.error("Error fetching announcements:", error);
        return null;
      }),
      fetchFromStrapi<GalleryAlbumsResponse>(
        "/gallery-albums?populate=*&sort=order:asc,event_date:desc&pagination[limit]=6"
      ).catch((error) => {
        console.error("Error fetching gallery:", error);
        return null;
      }),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Use fallback data if fetch failed
  if (!about) {
    return (
      <main
        className="min-h-screen"
        style={{ backgroundColor: "var(--school-grey)" }}
      >
        <Header />
        <section className="max-w-6xl mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--school-navy)" }}>
            Unable to Load Content
          </h1>
          <p className="text-slate-700">
            Please ensure Strapi is running and accessible.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  const data = about.data;
  const logoUrl = getStrapiMediaUrl(data.logo?.url);
  const profileUrl = getStrapiMediaUrl(data.profile_image?.url);

  // Process announcements - use fallback if fetch failed
  let announcements = announcementsResponse?.data || [];
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

  // Process gallery albums - use fallback if fetch failed
  let galleryAlbums = galleryResponse?.data || [];
  if (galleryAlbums.length > 0 && !galleryAlbums[0].attributes) {
    galleryAlbums = galleryAlbums.map((album: any) => ({
      id: album.id,
      attributes: {
        title: album.title,
        cover_image: album.cover_image,
      },
    })) as GalleryAlbum[];
  }

  // Process cover images
  galleryAlbums = galleryAlbums.map((album: any) => {
    const coverImage = album.attributes.cover_image;
    if (coverImage && !coverImage.data) {
      album.attributes.cover_image = { data: { attributes: coverImage as Media } };
    } else if (coverImage && coverImage.data && !coverImage.data.attributes) {
      album.attributes.cover_image = { data: { attributes: coverImage.data as Media } };
    }
    return album;
  });

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-32 px-6 min-h-[600px] flex items-center"
        style={{
          backgroundImage: profileUrl ? `url(${profileUrl})` : undefined,
          backgroundColor: profileUrl ? undefined : "var(--school-navy)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="max-w-3xl text-white">
            {data.mission && (
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {data.mission}
              </h1>
            )}
            {data.established_year && (
              <p className="text-xl mb-6" style={{ color: "var(--school-sky)" }}>
                Established in {data.established_year}
              </p>
            )}
            {data.history && (
              <p className="text-lg mb-8 text-slate-200 leading-relaxed">
                {data.history}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links / Feature Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-12"
            style={{ color: "var(--school-navy)" }}
          >
            Explore Our School
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              href="/academics"
              title="Academics"
              description="Excellence in education"
              icon="📚"
            />
            <FeatureCard
              href="/admissions"
              title="Admissions"
              description="Join our community"
              icon="🎓"
            />
            <FeatureCard
              href="/staff"
              title="Our Staff"
              description="Meet our educators"
              icon="👥"
            />
            <FeatureCard
              href="/gallery"
              title="Gallery"
              description="See our school life"
              icon="📸"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        className="py-16 px-6"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div
              className="text-4xl mb-4"
              style={{ color: "var(--school-navy)" }}
            >
              🎯
            </div>
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--school-navy)" }}
            >
              Our Mission
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed">
              {data.mission || "To provide quality education that nurtures excellence, character, and leadership."}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div
              className="text-4xl mb-4"
              style={{ color: "var(--school-navy)" }}
            >
              👁️
            </div>
            <h3
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--school-navy)" }}
            >
              Our Vision
            </h3>
            <p className="text-slate-700 text-lg leading-relaxed">
              {data.vision || "To be a leading institution that shapes future leaders and innovators."}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      {announcements.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2
                className="text-4xl font-bold"
                style={{ color: "var(--school-navy)" }}
              >
                Latest News & Announcements
              </h2>
              <Link
                href="/announcements"
                className="text-lg font-semibold hover:underline"
                style={{ color: "var(--school-navy)" }}
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.slice(0, 3).map((announcement) => {
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
                          alt={announcement.attributes.Title}
                          className="w-full h-full object-cover"
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
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {galleryAlbums.length > 0 && (
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "var(--school-grey-strong)" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2
                className="text-4xl font-bold"
                style={{ color: "var(--school-navy)" }}
              >
                Photo Gallery
              </h2>
              <Link
                href="/gallery"
                className="text-lg font-semibold hover:underline"
                style={{ color: "var(--school-navy)" }}
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {galleryAlbums.slice(0, 6).map((album) => {
                let coverUrl: string | null = null;
                const coverImage = album.attributes.cover_image as any;
                
                if (coverImage) {
                  if (coverImage.data?.attributes?.url) {
                    coverUrl = getStrapiMediaUrl(coverImage.data.attributes.url);
                  } else if (coverImage.url) {
                    coverUrl = getStrapiMediaUrl(coverImage.url);
                  } else if (coverImage.data?.url) {
                    coverUrl = getStrapiMediaUrl(coverImage.data.url);
                  }
                }

                return (
                  <Link
                    key={album.id}
                    href={`/gallery/${album.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                  >
                    {coverUrl ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={coverUrl}
                          alt={album.attributes.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video flex items-center justify-center"
                        style={{ backgroundColor: "var(--school-grey)" }}
                      >
                        <span className="text-slate-400">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3
                        className="font-semibold"
                        style={{ color: "var(--school-navy)" }}
                      >
                        {album.attributes.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {data.core_values && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl font-bold text-center mb-12"
              style={{ color: "var(--school-navy)" }}
            >
              Our Core Values
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-slate-700 text-lg leading-relaxed text-center">
                {data.core_values}
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

function FeatureCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: "var(--school-navy)" }}
      >
        {title}
      </h3>
      <p className="text-slate-600">{description}</p>
    </Link>
  );
}
