import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Statehouse School",
    template: "%s | Statehouse School",
  },
  description: "Excellence in education - Discipline, Excellence, Leadership. A leading educational institution committed to nurturing future leaders.",
  keywords: ["school", "education", "academics", "admissions", "Kenya"],
  authors: [{ name: "Statehouse School" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Statehouse School",
    title: "Statehouse School",
    description: "Excellence in education - Discipline, Excellence, Leadership",
  },
  twitter: {
    card: "summary_large_image",
    title: "Statehouse School",
    description: "Excellence in education - Discipline, Excellence, Leadership",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
