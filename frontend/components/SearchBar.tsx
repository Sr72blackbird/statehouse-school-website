"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search announcements, news..."
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            focusRingColor: "var(--school-navy)",
          }}
          aria-label="Search"
        />
        <FaSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-400">
            Searching...
          </span>
        )}
      </div>
    </form>
  );
}
