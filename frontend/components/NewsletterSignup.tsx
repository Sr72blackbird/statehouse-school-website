"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Disabled for now - coming soon
    setStatus("idle");
    setMessage("Newsletter signup is coming soon!");
    return;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md opacity-75">
      <h3
        className="text-xl font-bold mb-3"
        style={{ color: "var(--school-navy)" }}
      >
        Subscribe to Our Newsletter <span className="text-sm font-normal text-slate-500">(Coming Soon)</span>
      </h3>
      <p className="text-slate-700 mb-4 text-sm">
        Stay updated with the latest news, events, and announcements from our school.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2"
            aria-label="Email address (Coming soon)"
          />
          <button
            type="submit"
            disabled
            className="px-6 py-2 rounded-lg font-semibold transition-all opacity-50 cursor-not-allowed"
            style={{
              backgroundColor: "var(--school-navy)",
              color: "white",
            }}
          >
            Coming Soon
          </button>
        </div>
        {message && (
          <p
            className={`mt-2 text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
            role="alert"
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
