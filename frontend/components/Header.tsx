import Link from "next/link";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import MobileNav from "./MobileNav";
import NavBarClient from "./NavBarClient";
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
  const schoolName = data?.School_name || "State House Boys Senior School";

  return (
    <header>
      {/* Top school identity bar — scrolls with page */}
      <div
        className="flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-3 px-4"
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

      {/* Nav + gold stripe — sticky */}
      <div className="sticky top-0 left-0 right-0 z-40 shadow-md">
        <NavBarClient />
        <div className="h-1" style={{ backgroundColor: "var(--uniform-accent)" }} />
      </div>
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
      className="nav-link-glow text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline"
    >
      {children}
    </Link>
  );
}
