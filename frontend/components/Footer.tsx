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
        className="py-6 sm:py-8 px-4 sm:px-6"
        style={{ 
          background: "linear-gradient(180deg, rgba(110, 193, 228, 0.5) 0%, rgba(110, 193, 228, 0.3) 50%, rgba(236, 235, 231, 1) 100%)"
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Top section: five-column layout on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Column 1 - Logo / Name */}
            <div className="lg:col-span-1">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={`${data?.School_name || 'School'} logo`}
                  className="h-10 w-auto mb-3"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3 className="text-lg font-bold mb-1" style={{ color: "var(--school-navy)" }}>
                {data?.School_name || 'State House Boys Senior School'}
              </h3>
              <p className="text-sm" style={{ color: "var(--school-navy)" }}>
                Discipline • Excellence • Leadership
              </p>
            </div>

            {/* Column 2 - Quick Links (keeps internal two-column list) */}
            <div className="lg:col-span-1">
              <nav aria-label="Footer navigation">
                <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--school-navy)" }}>
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  <li><FooterLink href="/">Home</FooterLink></li>
                  <li><FooterLink href="/admissions">Admissions</FooterLink></li>
                  <li><FooterLink href="/about">About</FooterLink></li>
                  <li><FooterLink href="/academics">Academics</FooterLink></li>
                  <li><FooterLink href="/departments">Departments</FooterLink></li>
                  <li><FooterLink href="/staff">Staff</FooterLink></li>
                  <li><FooterLink href="/announcements">Announcements</FooterLink></li>
                  <li><FooterLink href="/gallery">Gallery</FooterLink></li>
                  <li><FooterLink href="/downloads">Downloads</FooterLink></li>
                </div>
              </nav>
            </div>

            {/* Column 3 - Contact info */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--school-navy)" }}>
                Contact Us
              </h4>
              <div className="space-y-1 text-sm text-slate-700">
                {data?.location && (
                  <p className="flex items-start"><span className="mr-2">📍</span>
                    {data.google_maps_embed_url ? (
                      <a href={data.google_maps_embed_url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--school-navy)" }}>{data.location}</a>
                    ) : (<span>{data.location}</span>)}</p>
                )}
                {data?.address && (<p className="flex items-start"><span className="mr-2">🏫</span><span>{data.address}</span></p>)}
                {data?.phone && (<p className="flex items-center"><span className="mr-2">📞</span><a href={`tel:${data.phone}`} className="hover:underline" style={{ color: "var(--school-navy)" }}>{data.phone}</a></p>)}
                {data?.email && (<p className="flex items-center"><span className="mr-2">✉️</span><a href={`mailto:${data.email}`} className="hover:underline" style={{ color: "var(--school-navy)" }}>{data.email}</a></p>)}
              </div>
            </div>

            {/* Column 4 - Social media buttons */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--school-navy)" }}>Follow Us</h4>
              <div className="flex gap-3 text-2xl">
                {data?.facebook_url && (<a href={data.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-75" style={{ color: "var(--school-navy)" }} aria-label="Visit our Facebook page">📘</a>)}
                {data?.twitter_url && (<a href={data.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-75" style={{ color: "var(--school-navy)" }} aria-label="Visit our Twitter page">🐦</a>)}
                {data?.instagram_url && (<a href={data.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-75 inline-flex items-center" style={{ color: "var(--school-navy)" }} aria-label="Visit our Instagram page" title="Instagram"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg></a>)}
                {data?.linkedin_url && (<a href={data.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-75" style={{ color: "var(--school-navy)" }} aria-label="Visit our LinkedIn page">💼</a>)}
                {data?.youtube_url && (<a href={data.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-75" style={{ color: "var(--school-navy)" }} aria-label="Visit our YouTube channel">▶️</a>)}
              </div>
            </div>

            {/* Column 5 - Map */}
            <div className="lg:col-span-1">
              {data?.google_maps_embed_url && data.google_maps_embed_url.includes('google.com/maps/embed') && (
                <div>
                  <iframe
                    src={data.google_maps_embed_url}
                    width="250"
                    height="250"
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
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="py-4 px-6 text-center text-sm"
        style={{ backgroundColor: "var(--school-navy)", color: "var(--school-sky)" }}
      >
        <p>
          © {currentYear} {data?.School_name || 'State House Boys Senior School'}. All rights reserved.
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
