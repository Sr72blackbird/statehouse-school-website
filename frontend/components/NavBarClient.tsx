"use client";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { useState, useEffect } from "react";

export default function NavBarClient() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`flex justify-between items-center py-2 sm:py-3 px-4 md:px-6 transition-colors duration-300 ${
        scrolled ? "bg-[var(--school-navy)] shadow-md" : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-wrap justify-center gap-2 md:gap-4 mx-auto">
        <Link href="/" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Home</Link>
        <Link href="/about" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">About</Link>
        <Link href="/admissions" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Admissions</Link>
        <Link href="/academics" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Academics</Link>
        <Link href="/departments" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Departments</Link>
        <Link href="/staff" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Staff</Link>
        <Link href="/announcements" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Announcements</Link>
        <Link href="/gallery" className="text-white font-medium transition-colors duration-200 px-2 py-1 hover:underline">Gallery</Link>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden ml-auto">
        <MobileNav />
      </div>
    </nav>
  );
}
