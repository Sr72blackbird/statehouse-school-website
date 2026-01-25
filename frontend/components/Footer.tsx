import Link from "next/link";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

type Media = {
  url: string;
};

type AboutSchool = {
  School_name: string;
  logo: Media | null;
  location: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  google_maps_embed_url: string | null;
  facebook_url?: string | null;
  twitter_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  youtube_url?: string | null;
};

type AboutSchoolResponse = {
  data: AboutSchool;
};

export default async function Footer() {
  let data: AboutSchool | null = null;

  try {
    const about = await fetchFromStrapi<AboutSchoolResponse>(
      "/about-the-school?populate=*"
    );
    data = about.data;
  } catch (error) {
    console.error("Error loading footer data:", error);
    // Continue with null data
  }

  const logoUrl = data ? getStrapiMediaUrl(data.logo?.url) : null;
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Gradient accent bar at top */}
      <div
        className="h-3"
        style={{ 
          background: "linear-gradient(90deg, var(--school-navy) 0%, var(--school-sky) 50%, var(--school-navy) 100%)"
        }}
      />

      {/* Main footer content with gradient */}
      <div
        className="py-8 sm:py-12 px-4 sm:px-6"
        style={{ 
          background: "linear-gradient(180deg, rgba(110, 193, 228, 0.5) 0%, rgba(110, 193, 228, 0.3) 50%, rgba(236, 235, 231, 1) 100%)"
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className={`grid gap-6 sm:gap-8 mb-6 sm:mb-8 ${(data?.location || data?.address || data?.phone || data?.email || data?.google_maps_embed_url) ? 'sm:grid-cols-2 md:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {/* School Info */}
            <div>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={`${data?.School_name || 'School'} logo`}
                  className="h-10 w-auto mb-4"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--school-navy)" }}
              >
                {data?.School_name || 'Statehouse School'}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--school-navy)" }}
              >
                Discipline • Excellence • Leadership
              </p>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer navigation">
              <h4
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--school-navy)" }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2" role="list">
                <li>
                  <FooterLink href="/">Home</FooterLink>
                </li>
                <li>
                  <FooterLink href="/about">About</FooterLink>
                </li>
                <li>
                  <FooterLink href="/admissions">Admissions</FooterLink>
                </li>
                <li>
                  <FooterLink href="/academics">Academics</FooterLink>
                </li>
                <li>
                  <FooterLink href="/departments">Departments</FooterLink>
                </li>
                <li>
                  <FooterLink href="/staff">Staff</FooterLink>
                </li>
                <li>
                  <FooterLink href="/announcements">Announcements</FooterLink>
                </li>
                <li>
                  <FooterLink href="/gallery">Gallery</FooterLink>
                </li>
              </ul>
            </nav>

            {/* Contact / Additional Info */}
            {(data?.location || data?.address || data?.phone || data?.email || data?.google_maps_embed_url) && (
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--school-navy)" }}
                >
                  Contact Us
                </h4>
                <div className="space-y-2 text-sm text-slate-700">
                  {data?.location && (
                    <p className="flex items-start">
                      <span className="mr-2">📍</span>
                      {data.google_maps_embed_url ? (
                        <a
                          href={data.google_maps_embed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                          style={{ color: "var(--school-navy)" }}
                        >
                          {data.location}
                        </a>
                      ) : (
                        <span>{data.location}</span>
                      )}
                    </p>
                  )}
                  {data?.address && (
                    <p className="flex items-start">
                      <span className="mr-2">🏫</span>
                      <span>{data.address}</span>
                    </p>
                  )}
                  {data?.phone && (
                    <p className="flex items-center">
                      <span className="mr-2">📞</span>
                      <a
                        href={`tel:${data.phone}`}
                        className="hover:underline"
                        style={{ color: "var(--school-navy)" }}
                      >
                        {data.phone}
                      </a>
                    </p>
                  )}
                  {data?.email && (
                    <p className="flex items-center">
                      <span className="mr-2">✉️</span>
                      <a
                        href={`mailto:${data.email}`}
                        className="hover:underline"
                        style={{ color: "var(--school-navy)" }}
                      >
                        {data.email}
                      </a>
                    </p>
                  )}
                  {data?.google_maps_embed_url && data.google_maps_embed_url.includes('google.com/maps/embed') && (
                    <div className="mt-4">
                      <iframe
                        src={data.google_maps_embed_url}
                        width="100%"
                        height="180"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                
                {/* Social Media Links */}
                {(data?.facebook_url || data?.twitter_url || data?.instagram_url || data?.linkedin_url || data?.youtube_url) && (
                  <div className="mt-6">
                    <h4
                      className="text-lg font-semibold mb-3"
                      style={{ color: "var(--school-navy)" }}
                    >
                      Follow Us
                    </h4>
                    <div className="flex gap-3">
                      {data?.facebook_url && (
                        <a
                          href={data.facebook_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl hover:opacity-75 transition-opacity"
                          style={{ color: "var(--school-navy)" }}
                          aria-label="Visit our Facebook page"
                        >
                          📘
                        </a>
                      )}
                      {data?.twitter_url && (
                        <a
                          href={data.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl hover:opacity-75 transition-opacity"
                          style={{ color: "var(--school-navy)" }}
                          aria-label="Visit our Twitter page"
                        >
                          🐦
                        </a>
                      )}
                      {data?.instagram_url && (
                        <a
                          href={data.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl hover:opacity-75 transition-opacity"
                          style={{ color: "var(--school-navy)" }}
                          aria-label="Visit our Instagram page"
                        >
                          📷
                        </a>
                      )}
                      {data?.linkedin_url && (
                        <a
                          href={data.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl hover:opacity-75 transition-opacity"
                          style={{ color: "var(--school-navy)" }}
                          aria-label="Visit our LinkedIn page"
                        >
                          💼
                        </a>
                      )}
                      {data?.youtube_url && (
                        <a
                          href={data.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl hover:opacity-75 transition-opacity"
                          style={{ color: "var(--school-navy)" }}
                          aria-label="Visit our YouTube channel"
                        >
                          ▶️
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="py-4 px-6 text-center text-sm"
        style={{ backgroundColor: "var(--school-navy)", color: "var(--school-sky)" }}
      >
        <p>
          © {currentYear} {data?.School_name || 'Statehouse School'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-700 hover:underline block"
      style={{ color: "var(--school-navy)" }}
    >
      {children}
    </Link>
  );
}
