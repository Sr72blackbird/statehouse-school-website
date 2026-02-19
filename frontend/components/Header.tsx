import Link from "next/link";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import MobileNav from "./MobileNav";
// import SearchBar from "./SearchBar"; // Hidden for now

type Media = {
  url: string;
};

type AboutSchool = {
  School_name: string;
  logo: Media | null;
};

type AboutSchoolResponse = {
  data: AboutSchool | null;
};

export default async function Header() {
  let data: AboutSchool | null = null;

  try {
    const about = await fetchFromStrapi<AboutSchoolResponse>(
      "/about-the-school?populate=logo"
    );
    data = about.data;
  } catch (error) {
    console.error("Error loading header data:", error);
    // Continue with null data
  }

  const logoUrl = data ? getStrapiMediaUrl(data.logo?.url) : null;
  const schoolName = data?.School_name || "Statehouse School";

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      {/* Top school identity bar */}
      <div
        className="flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 px-4"
        style={{ backgroundColor: "var(--school-navy)" }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${schoolName} logo`}
            className="h-8 sm:h-10 md:h-12 w-auto"
            loading="eager"
            decoding="async"
          />
        )}

        <div className="text-center">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold" id="site-title">
            {schoolName}
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--school-sky)" }}
            aria-label="School motto"
          >
            Discipline • Excellence • Leadership
          </p>
        </div>
      </div>

      {/* Tie stripe accent */}
      <div
        className="h-1"
        style={{ backgroundColor: "var(--uniform-accent)" }}
      />

      {/* Navigation bar - Transparent, overlays hero image */}
      <nav
        className="flex justify-between items-center py-3 sm:py-4 px-4 md:px-6"
        aria-label="Main navigation"
      >
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-wrap justify-center gap-2 md:gap-4 mx-auto">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/admissions">Admissions</NavLink>
          <NavLink href="/academics">Academics</NavLink>
          <NavLink href="/departments">Departments</NavLink>
          <NavLink href="/staff">Staff</NavLink>
          <NavLink href="/announcements">Announcements</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden ml-auto">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="nav-link-glow px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105"
    >
      {children}
    </Link>
  );
}
