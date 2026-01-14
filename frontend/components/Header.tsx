import Link from "next/link";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
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
  let data: AboutSchool = {
    School_name: "Statehouse School",
    logo: null,
  };

  try {
    const about = await fetchFromStrapi<AboutSchoolResponse>(
      "/about-the-school?populate=logo"
    );
    
    if (about?.data) {
      data = about.data;
    }
  } catch (error) {
    console.error("Error loading header data:", error);
    // Use default data already set above
  }

  const logoUrl = getStrapiMediaUrl(data.logo?.url);

  return (
    <header>
      {/* Top school identity bar */}
      <div
        className="flex items-center justify-center gap-2 sm:gap-4 py-3 sm:py-4 px-4"
        style={{ backgroundColor: "var(--school-navy)" }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${data.School_name} logo`}
            className="h-8 sm:h-10 md:h-12 w-auto"
            loading="eager"
            decoding="async"
          />
        )}

        <div className="text-center">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold" id="site-title">
            {data.School_name}
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

      {/* Navigation bar */}
      <nav
        className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 md:gap-6 py-2 sm:py-3 text-xs sm:text-sm font-medium px-4"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
        aria-label="Main navigation"
      >
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/admissions">Admissions</NavLink>
          <NavLink href="/academics">Academics</NavLink>
          <NavLink href="/departments">Departments</NavLink>
          <NavLink href="/staff">Staff</NavLink>
          <NavLink href="/announcements">Announcements</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
        </div>
        {/* SearchBar hidden for now */}
        {/* <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <SearchBar />
        </div> */}
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
      className="px-2 py-1 rounded hover:underline"
      style={{ color: "var(--school-navy)" }}
    >
      {children}
    </Link>
  );
}
