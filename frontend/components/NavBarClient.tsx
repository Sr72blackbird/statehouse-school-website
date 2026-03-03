"use client";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/admissions", label: "Admissions" },
  { href: "/academics", label: "Academics" },
  { href: "/departments", label: "Departments" },
  { href: "/staff", label: "Staff" },
  { href: "/announcements", label: "Announcements" },
  { href: "/gallery", label: "Gallery" },
];

export default function NavBarClient() {
  const pathname = usePathname();

  return (
    <nav
      className="flex justify-between items-center py-2 sm:py-3 px-4 md:px-6"
      style={{ backgroundColor: "var(--school-navy)" }}
      aria-label="Main navigation"
    >
      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-wrap justify-center gap-1 mx-auto">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname === href ? " active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden ml-auto">
        <MobileNav />
      </div>
    </nav>
  );
}
