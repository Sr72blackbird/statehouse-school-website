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
};

type AboutSchoolResponse = {
  data: AboutSchool;
};

export default async function Footer() {
  const about = await fetchFromStrapi<AboutSchoolResponse>(
    "/about-the-school?populate=logo"
  );

  const data = about.data;
  const logoUrl = getStrapiMediaUrl(data.logo?.url);
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Tie stripe accent */}
      <div
        className="h-1"
        style={{ backgroundColor: "var(--uniform-accent)" }}
      />

      {/* Main footer content */}
      <div
        className="py-12 px-6"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className={`grid gap-8 mb-8 ${(data.location || data.address || data.phone || data.email || data.google_maps_embed_url) ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {/* School Info */}
            <div>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="School logo"
                  className="h-10 w-auto mb-4"
                />
              )}
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--school-navy)" }}
              >
                {data.School_name}
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--school-navy)" }}
              >
                Discipline • Excellence • Leadership
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--school-navy)" }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
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
            </div>

            {/* Contact / Additional Info */}
            {(data.location || data.address || data.phone || data.email || data.google_maps_embed_url) && (
              <div>
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--school-navy)" }}
                >
                  Contact Us
                </h4>
                <div className="space-y-2 text-sm text-slate-700">
                  {data.location && (
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
                  {data.address && (
                    <p className="flex items-start">
                      <span className="mr-2">🏫</span>
                      <span>{data.address}</span>
                    </p>
                  )}
                  {data.phone && (
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
                  {data.email && (
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
                  {data.google_maps_embed_url && (
                    <div className="mt-4">
                      <iframe
                        src={data.google_maps_embed_url}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
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
          © {currentYear} {data.School_name}. All rights reserved.
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
