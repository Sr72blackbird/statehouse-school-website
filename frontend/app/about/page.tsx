import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const about = await fetchFromStrapi<AboutSchoolResponse>(
      "/about-the-school?populate=logo"
    );
    const schoolName = about.data?.School_name || "Our School";
    
    return {
      title: "About",
      description: `Learn about ${schoolName} - our history, mission, vision, and core values.`,
      openGraph: {
        title: `About ${schoolName}`,
        description: `Learn about ${schoolName} - our history, mission, vision, and core values.`,
      },
    };
  } catch {
    return {
      title: "About",
      description: "Learn about our school - history, mission, vision, and core values.",
    };
  }
}

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
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  google_maps_embed_url: string | null;
};

type AboutSchoolResponse = {
  data: AboutSchool;
};

export default async function AboutPage() {
  let data: AboutSchool | null = null;

  try {
    const about = await fetchFromStrapi<AboutSchoolResponse>(
      "/about-the-school?populate=*"
    );
    data = about.data;
  } catch (error) {
    console.error("Failed to fetch about data:", error);
    // Continue with null data - page will render with fallback content
  }

  // Default values for when data is not available
  const schoolName = data?.School_name || "Our School";
  const logoUrl = data ? getStrapiMediaUrl(data.logo?.url) : null;
  const profileUrl = data ? getStrapiMediaUrl(data.profile_image?.url) : null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title={`About ${schoolName}`}
          subtitle={data?.established_year ? `Established in ${data.established_year}` : undefined}
          backgroundImage={profileUrl}
        />
      </section>

      {/* History Section */}
      {data?.history && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
              style={{ color: "var(--school-navy)" }}
            >
              Our History
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {data.history}
            </p>
          </div>
        </section>
      )}

      {/* Mission / Vision / Core Values */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {data?.mission && (
              <div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--school-navy)" }}
                >
                  Our Mission
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {data.mission}
                </p>
              </div>
            )}

            {data?.vision && (
              <div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--school-navy)" }}
                >
                  Our Vision
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {data.vision}
                </p>
              </div>
            )}

            {data?.core_values && (
              <div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--school-navy)" }}
                >
                  Core Values
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {data.core_values}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      {(data?.location || data?.address || data?.phone || data?.email || data?.google_maps_embed_url) && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: "var(--school-grey-strong)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center"
              style={{ color: "var(--school-navy)" }}
            >
              Location & Contact
            </h2>
            
            {/* Google Maps Embed */}
            {data?.google_maps_embed_url && (
              <div className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3
                  className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
                  style={{ color: "var(--school-navy)" }}
                >
                  📍 Find Us on Google Maps
                </h3>
                <div className="w-full overflow-hidden rounded-lg">
                  <iframe
                    src={data.google_maps_embed_url}
                    width="100%"
                    height="300"
                    className="sm:h-[400px] md:h-[450px]"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {data?.location && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--school-navy)" }}
                  >
                    📍 Location
                  </h3>
                  {data.google_maps_embed_url ? (
                    <a
                      href={data.google_maps_embed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:underline block"
                      style={{ color: "var(--school-navy)" }}
                    >
                      {data.location}
                    </a>
                  ) : (
                    <p className="text-slate-700">{data.location}</p>
                  )}
                </div>
              )}
              {data?.address && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--school-navy)" }}
                  >
                    🏫 Address
                  </h3>
                  <p className="text-slate-700 whitespace-pre-line">{data.address}</p>
                </div>
              )}
              {data?.phone && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--school-navy)" }}
                  >
                    📞 Phone
                  </h3>
                  <a
                    href={`tel:${data.phone}`}
                    className="text-slate-700 hover:underline"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {data.phone}
                  </a>
                </div>
              )}
              {data?.email && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--school-navy)" }}
                  >
                    ✉️ Email
                  </h3>
                  <a
                    href={`mailto:${data.email}`}
                    className="text-slate-700 hover:underline"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {data.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
