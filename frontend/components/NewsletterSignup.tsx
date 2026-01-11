"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Unable to subscribe. Please try again later.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3
        className="text-xl font-bold mb-3"
        style={{ color: "var(--school-navy)" }}
      >
        Subscribe to Our Newsletter
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
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--school-navy)] focus:ring-offset-2"
            aria-label="Email address"
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: status === "success" ? "#10b981" : "var(--school-navy)",
              color: "white",
            }}
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
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
