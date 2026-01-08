import Link from "next/link";

export default function Header() {
  return (
    <header>
      {/* Top school identity bar */}
      <div
        className="text-center py-6"
        style={{ backgroundColor: "var(--school-navy)" }}
      >
        <h1 className="text-white text-3xl font-bold">
          State House Boys High School
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--school-sky)" }}
        >
          Discipline • Excellence • Leadership
        </p>
      </div>

      {/* Tie stripe accent */}
      <div
        className="h-1"
        style={{ backgroundColor: "var(--uniform-accent)" }}
      />

      {/* Navigation bar */}
      <nav
        className="flex justify-center gap-8 py-3 text-sm font-medium"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/admissions">Admissions</NavLink>
        <NavLink href="/academics">Academics</NavLink>
        <NavLink href="/departments">Departments</NavLink>
        <NavLink href="/contact">Contact</NavLink>
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
