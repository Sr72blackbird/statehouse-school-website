"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ClientRefresherProps {
  /** Pass true when critical server data came back null (Strapi was cold/unreachable) */
  dataIsEmpty: boolean;
  /** Seconds to wait before auto-refreshing. Default 8. */
  delaySeconds?: number;
}

/**
 * When Strapi is cold-starting on Render's free tier the first SSR request
 * times out and the page renders with no content.  This component detects
 * that situation and automatically refreshes the page after a short delay,
 * by which time Strapi will have finished booting.
 */
export default function ClientRefresher({
  dataIsEmpty,
  delaySeconds = 8,
}: ClientRefresherProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(delaySeconds);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!dataIsEmpty) return;

    // Small delay before showing the banner so it doesn't flash on fast connections
    const showTimer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(showTimer);
  }, [dataIsEmpty]);

  useEffect(() => {
    if (!dataIsEmpty) return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          router.refresh();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dataIsEmpty, router]);

  if (!dataIsEmpty || !visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg text-white text-sm font-medium"
      style={{ backgroundColor: "var(--school-navy)" }}
    >
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>
        Loading content from server&hellip; refreshing in{" "}
        <strong>{countdown}s</strong>
      </span>
      <button
        onClick={() => router.refresh()}
        className="ml-2 underline underline-offset-2 hover:opacity-80"
      >
        Refresh now
      </button>
    </div>
  );
}
