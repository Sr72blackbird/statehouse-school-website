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
  tagline: string | null;
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

      {/* Gradient Wrapper for Content Sections */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(110, 193, 228, 0.25) 15%, rgba(110, 193, 228, 0.35) 35%, rgba(10, 31, 68, 0.15) 60%, rgba(10, 31, 68, 0.08) 80%, rgba(255, 255, 255, 1) 100%)"
        }}
      >
      {/* Hardcoded History Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
              style={{ color: "var(--school-navy)" }}
            >
              Our History
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-slate-700 leading-relaxed">
              <p>
                The school was started as a Double-streamed Day Public Secondary school by the then president of Kenya, His Excellency the late Daniel Arap Moi. The school was started in order to assist in meeting the large and growing need for post-primary education in Nairobi.
              </p>
              <p>
                At its inception, the then headteacher of Nairobi Primary School, Mr. J Agak, doubled up as the first headmaster of the school. The school was registered on 20th June 1986 as Nairobi Mixed Secondary School and in 1987, the school became an exclusively boys' school following a cross transfer between boys and girls of St. George's and Nairobi Mixed Secondary School.
              </p>
              <p>
                In 1981, the school received its first independent headteacher, Mr. W.S. Kimereng. He registered the school for the KCSE Examinations and got the Centre code 41086. In 1990, the school's name was officially changed to Nairobi Milimani Secondary School, thereby occasioning a re-registration in 1991. On 6th December 2016, it changed its day-only status when it was re-registered as a day/boarding school.
              </p>
              <p>
                Following this re-registration in 2017, the boarding section was launched with the admission of the Form 1 students as pioneer boarders. On 19th March 2024, the school rebranded to State House Boys High School and got a new registration certificate.
              </p>
              <p>
                The current population of the school is at 660 students. They are all boarders. Through the government grant, two classes were constructed in 2017 and handed over in January 2018.
              </p>
              <p>
                The current vision of the school is to be a "Leading value adding education Centre that facilitates the exploitation of the learner's full potential."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principals Board of Honour */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: "var(--school-navy)" }}>
            {/* Header */}
            <div className="text-center py-8 px-6" style={{ borderBottom: "2px solid rgba(255,215,0,0.3)" }}>
              <p className="text-xs tracking-[0.3em] font-semibold mb-1" style={{ color: "rgba(255,215,0,0.7)" }}>
                STATE HOUSE BOYS HIGH SCHOOL
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFD700" }}>
                Principals Board of Honour
              </h2>
            </div>

            {/* Table */}
            <div className="px-6 sm:px-10 py-8">
              <div className="space-y-0 divide-y" style={{ borderColor: "rgba(255,215,0,0.15)" }}>
                {[
                  { name: "Mr. Josiah Agak",      years: "1986 – 1988" },
                  { name: "Mr. W.S. Kimereng",    years: "1989 – 1998" },
                  { name: "Mr. P.J.M. Githinji",  years: "1998 – 2000" },
                  { name: "Mr. G. Ikaba",          years: "2001 – 2002" },
                  { name: "Mr. P.G. Musyoka",      years: "2003 – 2006" },
                  { name: "Mr. F.M. Muthui",       years: "2006 – 2010" },
                  { name: "Mrs. Mokemwa",          years: "2011 – 2019" },
                  { name: "Mr. Timmy Masake",      years: "2020 – 2022" },
                  { name: "Mr. Vincent Akuka",     years: "2022 – Present", current: true },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 px-2 sm:px-4"
                    style={{
                      background: p.current ? "rgba(255,215,0,0.08)" : "transparent",
                      borderColor: "rgba(255,215,0,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          backgroundColor: p.current ? "#FFD700" : "rgba(255,215,0,0.15)",
                          color: p.current ? "var(--school-navy)" : "rgba(255,215,0,0.7)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="font-semibold text-base sm:text-lg tracking-wide"
                        style={{ color: p.current ? "#FFD700" : "rgba(255,255,255,0.9)" }}
                      >
                        {p.name}
                        {p.current && (
                          <span
                            className="ml-3 text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "rgba(255,215,0,0.2)", color: "#FFD700" }}
                          >
                            Current
                          </span>
                        )}
                      </span>
                    </div>
                    <span
                      className="text-sm sm:text-base font-mono tracking-wider flex-shrink-0"
                      style={{ color: "rgba(255,215,0,0.65)" }}
                    >
                      {p.years}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOM Chairpersons Board */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: "var(--school-navy)" }}>
            {/* Header */}
            <div className="text-center py-8 px-6" style={{ borderBottom: "2px solid rgba(255,215,0,0.3)" }}>
              <p className="text-xs tracking-[0.3em] font-semibold mb-1" style={{ color: "rgba(255,215,0,0.7)" }}>
                STATE HOUSE BOYS HIGH SCHOOL
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFD700" }}>
                B.O.M Chairpersons
              </h2>
            </div>

            {/* Table */}
            <div className="px-6 sm:px-10 py-8">
              <div className="flex justify-between text-xs font-bold tracking-widest uppercase mb-4 px-2 sm:px-4" style={{ color: "rgba(255,215,0,0.5)" }}>
                <span>Name</span>
                <span>Tenure</span>
              </div>
              <div className="space-y-0 divide-y" style={{ borderColor: "rgba(255,215,0,0.15)" }}>
                {[
                  { name: "Mr. Paul Aludo",           years: "1986 – 1994" },
                  { name: "Mr. J.K. Kipsanai",        years: "1994 – 1999" },
                  { name: "Mr. C. Ndirangu",           years: "1999 – 2005" },
                  { name: "Mrs. L. Lungahi",           years: "2005 – 2009" },
                  { name: "Mr. James Kamau",           years: "2009 – 2015" },
                  { name: "Gov. Mutula Kilonzo Jnr",  years: "2015 – Present", current: true },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 px-2 sm:px-4"
                    style={{
                      background: p.current ? "rgba(255,215,0,0.08)" : "transparent",
                      borderColor: "rgba(255,215,0,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          backgroundColor: p.current ? "#FFD700" : "rgba(255,215,0,0.15)",
                          color: p.current ? "var(--school-navy)" : "rgba(255,215,0,0.7)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="font-semibold text-base sm:text-lg tracking-wide"
                        style={{ color: p.current ? "#FFD700" : "rgba(255,255,255,0.9)" }}
                      >
                        {p.name}
                        {p.current && (
                          <span
                            className="ml-3 text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "rgba(255,215,0,0.2)", color: "#FFD700" }}
                          >
                            Current
                          </span>
                        )}
                      </span>
                    </div>
                    <span
                      className="text-sm sm:text-base font-mono tracking-wider flex-shrink-0"
                      style={{ color: "rgba(255,215,0,0.65)" }}
                    >
                      {p.years}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Core Values */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {data?.mission && (
              <div className="bg-white rounded-lg shadow-md p-6">
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
              <div className="bg-white rounded-lg shadow-md p-6">
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
              <div className="bg-white rounded-lg shadow-md p-6">
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
        <section className="py-12 sm:py-16">
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
      </div>

      <Footer />
    </main>
  );
}
