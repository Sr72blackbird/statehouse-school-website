import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlideshow from "@/components/HeroSlideshow";
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
  profile_image: Media | Media[] | null;
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

type Club = {
  id: number;
  attributes: {
    name: string;
    description: any;
    image: { data: { attributes: Media } | null } | null;
    patron: { data: { attributes: { full_name: string } } | null } | null;
    patron_name: string | null;
    meeting_schedule: string | null;
    order: number | null;
  };
};

type ClubsResponse = {
  data: Club[];
};

export default async function Home() {
  // Default data
  let data: AboutSchool = {
    School_name: "Statehouse School",
    history: null,
    mission: "To provide quality education that nurtures excellence.",
    vision: "To be a leading institution of academic excellence.",
    core_values: null,
    established_year: null,
    logo: null,
    profile_image: null,
  };

  let announcements: Announcement[] = [];
  let galleryAlbums: GalleryAlbum[] = [];
  let clubs: Club[] = [];

  // Fetch all data in parallel
  try {
    const [aboutResponse, announcementsResponse, galleryResponse, clubsResponse] = await Promise.all([
      fetchFromStrapi<AboutSchoolResponse>("/about-the-school?populate=*"),
      fetchFromStrapi<AnnouncementsResponse>(
        "/announcements?populate=*&sort=Date:desc&filters[Published][$eq]=true&pagination[limit]=3"
      ),
      fetchFromStrapi<GalleryAlbumsResponse>(
        "/gallery-albums?populate=*&sort=order:asc&pagination[limit]=4"
      ),
      fetchFromStrapi<ClubsResponse>(
        "/clubs?populate[patron][populate]=*&populate[image][populate]=*&sort=order:asc&pagination[limit]=6"
      ),
    ]);

    if (aboutResponse.data) {
      data = aboutResponse.data;
    }

    if (announcementsResponse.data) {
      // Handle flat data structure
      announcements = announcementsResponse.data.map((ann: any) => {
        if (!ann.attributes) {
          return {
            id: ann.id,
            attributes: {
              Title: ann.Title,
              Slug: ann.Slug || ann.Title?.toLowerCase().replace(/\s+/g, "-") || `announcement-${ann.id}`,
              Date: ann.Date,
              Category: ann.Category,
              Image: ann.Image,
            },
          };
        }
        return ann;
      });
    }

    if (galleryResponse.data) {
      // Handle flat data structure
      galleryAlbums = galleryResponse.data.map((album: any) => {
        if (!album.attributes) {
          return {
            id: album.id,
            attributes: {
              title: album.title,
              cover_image: album.cover_image,
            },
          };
        }
        return album;
      });
    }

    if (clubsResponse.data) {
      // Handle flat data structure
      clubs = clubsResponse.data.map((club: any) => {
        if (!club.attributes) {
          return {
            id: club.id,
            attributes: {
              name: club.name,
              description: club.description,
              image: club.image,
              patron: club.patron,
              patron_name: club.patron_name,
              meeting_schedule: club.meeting_schedule,
              order: club.order,
            },
          };
        }
        return club;
      });
    }
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  // Helper to get image URL from various structures
  const getImageUrl = (imageField: any): string | null => {
    if (!imageField) return null;
    if (imageField.data?.attributes?.url) {
      return getStrapiMediaUrl(imageField.data.attributes.url);
    }
    if (imageField.url) {
      return getStrapiMediaUrl(imageField.url);
    }
    if (imageField.data?.url) {
      return getStrapiMediaUrl(imageField.data.url);
    }
    return null;
  };

  // Build hero images array from profile_image field only (supports multiple images)
  const heroImages: string[] = [];
  const profileImages = data.profile_image;
  if (profileImages) {
    // Handle array of images
    if (Array.isArray(profileImages)) {
      profileImages.forEach((img: any) => {
        const url = getStrapiMediaUrl(img.url);
        if (url) heroImages.push(url);
      });
    } 
    // Handle single image object
    else if ((profileImages as Media).url) {
      const url = getStrapiMediaUrl((profileImages as Media).url);
      if (url) heroImages.push(url);
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "News":
        return "bg-blue-100 text-blue-800";
      case "Event":
        return "bg-green-100 text-green-800";
      case "Notice":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Header overlay */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        <Header />
        {/* Background Image Slideshow */}
        <HeroSlideshow images={heroImages} interval={6000} />
        {/* Dark Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: heroImages.length > 0
              ? "linear-gradient(135deg, rgba(10, 31, 68, 0.6) 0%, rgba(26, 58, 110, 0.5) 100%)"
              : "linear-gradient(135deg, var(--school-navy) 0%, #1a3a6e 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 sm:pt-44 lg:pt-48 pb-24 lg:pb-32 flex items-center min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-3xl">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium">
                  {data.established_year ? `Established ${data.established_year}` : "Excellence in Education"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Welcome to{" "}
                <span style={{ color: "var(--school-sky)" }}>
                  {data.School_name}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {data.mission || "To provide quality education that nurtures academic excellence, moral integrity, and holistic development in every learner."}
              </p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-[1px]">
          <svg 
            viewBox="0 0 1440 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            preserveAspectRatio="none" 
            className="w-full h-[60px] md:h-[80px] lg:h-[120px]"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Gradient wrapper for Quick Links, Our Purpose, and Announcements */}
      <div 
        className="relative"
        style={{ 
          background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(110, 193, 228, 0.25) 15%, rgba(110, 193, 228, 0.35) 35%, rgba(10, 31, 68, 0.15) 60%, rgba(10, 31, 68, 0.08) 80%, rgba(255, 255, 255, 1) 100%)"
        }}
      >
        {/* Subtle decorative gradient overlay */}
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 20% 30%, rgba(110, 193, 228, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(10, 31, 68, 0.2) 0%, transparent 50%)"
          }}
        />

        {/* Quick Links Section */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Admissions",
                description: "Join our community",
                href: "/admissions",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ),
              },
              {
                title: "Academics",
                description: "Explore our curriculum",
                href: "/academics",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                title: "Our Staff",
                description: "Meet our educators",
                href: "/staff",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                title: "Gallery",
                description: "See school life",
                href: "/gallery",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-6 rounded-xl border-2 border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                  style={{ backgroundColor: "var(--school-grey)", color: "var(--school-navy)" }}
                >
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--school-navy)" }}>
                  {link.title}
                </h3>
                <p className="text-slate-600 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--school-navy)" }}>
              Our Purpose
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Guided by our mission and vision, we strive to provide exceptional education that shapes future leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "var(--school-sky)", color: "var(--school-navy)" }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--school-navy)" }}>
                Our Mission
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {data.mission || "To provide quality education that nurtures academic excellence, moral integrity, and holistic development in every learner."}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "var(--uniform-accent)", color: "var(--school-navy)" }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--school-navy)" }}>
                Our Vision
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {data.vision || "To be a leading institution that inspires excellence and produces well-rounded individuals ready to make a positive impact in society."}
              </p>
            </div>
          </div>

          {/* Core Values */}
          {data.core_values && (
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--school-navy)" }}>
                Our Core Values
              </h3>
              <p className="text-slate-600 text-center leading-relaxed max-w-4xl mx-auto">
                {data.core_values}
              </p>
            </div>
          )}
        </div>
        </section>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--school-navy)" }}>
                  Latest Updates
                </h2>
                <p className="text-slate-600 mt-2">Stay informed with our latest news and events</p>
              </div>
              <Link
                href="/announcements"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-colors duration-300 hover:opacity-90"
                style={{ backgroundColor: "var(--school-navy)", color: "white" }}
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => {
                const imageUrl = getImageUrl(announcement.attributes.Image);
                return (
                  <Link
                    key={announcement.id}
                    href={`/announcements/${announcement.attributes.Slug}`}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={announcement.attributes.Title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--school-grey)" }}>
                          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        {announcement.attributes.Category && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.attributes.Category)}`}>
                            {announcement.attributes.Category}
                          </span>
                        )}
                        {announcement.attributes.Date && (
                          <span className="text-sm text-slate-500">
                            {formatDate(announcement.attributes.Date)}
                          </span>
                        )}
                      </div>
                      <h3
                        className="font-bold text-lg group-hover:opacity-80 transition-opacity line-clamp-2"
                        style={{ color: "var(--school-navy)" }}
                      >
                        {announcement.attributes.Title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Clubs & Societies Section */}
      {clubs.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--school-navy)" }}>
                Clubs & Societies
              </h2>
              <p className="text-slate-600 mt-2">Explore our vibrant extracurricular activities</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => {
                const clubImageUrl = getImageUrl(club.attributes.image);
                // Get patron name from relation or direct field
                const patronName = club.attributes.patron?.data?.attributes?.full_name || club.attributes.patron_name;
                
                return (
                  <div
                    key={club.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-video bg-slate-100 overflow-hidden">
                      {clubImageUrl ? (
                        <img
                          src={clubImageUrl}
                          alt={club.attributes.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--school-grey)" }}>
                          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3
                        className="font-bold text-lg mb-2"
                        style={{ color: "var(--school-navy)" }}
                      >
                        {club.attributes.name}
                      </h3>
                      {patronName && (
                        <p className="text-slate-600 text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Patron: {patronName}
                        </p>
                      )}
                      {club.attributes.meeting_schedule && (
                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {club.attributes.meeting_schedule}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      </div>
      {/* End of gradient wrapper */}

      {/* Gallery Preview Section */}
      {galleryAlbums.length > 0 && (
        <section className="py-20" style={{ background: "linear-gradient(135deg, #0a1f44 0%, #1a3a6e 50%, #0a1f44 100%)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  School Life in Pictures
                </h2>
                <p className="text-white/70 mt-2">Glimpses of our vibrant school community</p>
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "var(--school-sky)", color: "var(--school-navy)" }}
              >
                View Gallery
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryAlbums.slice(0, 4).map((album, index) => {
                const coverUrl = getImageUrl(album.attributes.cover_image);
                return (
                  <Link
                    key={album.id}
                    href={`/gallery/${album.id}`}
                    className={`group relative overflow-hidden rounded-xl ${
                      index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                    }`}
                  >
                    <div className="absolute inset-0 bg-slate-800">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={album.attributes.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-700">
                          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold truncate">{album.attributes.title}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
