import Link from "next/link";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

type Media = {
  url: string;
};

type AboutSchool = {
  School_name: string;
  logo: Media | null;
};

type AboutSchoolResponse = {
  data: AboutSchool;
};

export default async function Header() {
  const about = await fetchFromStrapi<AboutSchoolResponse>(
    "/about-the-school?populate=logo"
  );

  const data = about.data;

  const logoUrl = getStrapiMediaUrl(data.logo?.url);

  return (
    <header>
      {/* Top school identity bar */}
      <div
        className="flex items-center justify-center gap-4 py-4"
        style={{ backgroundColor: "var(--school-navy)" }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt="School logo"
            className="h-12 w-auto"
          />
        )}

        <div className="text-center">
          <h1 className="text-white text-2xl font-bold">
            {data.School_name}
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--school-sky)" }}
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
        className="flex justify-center gap-6 py-3 text-sm font-medium flex-wrap"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/admissions">Admissions</NavLink>
        <NavLink href="/academics">Academics</NavLink>
        <NavLink href="/departments">Departments</NavLink>
        <NavLink href="/staff">Staff</NavLink>
        <NavLink href="/announcements">Announcements</NavLink>
        <NavLink href="/gallery">Gallery</NavLink>
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
