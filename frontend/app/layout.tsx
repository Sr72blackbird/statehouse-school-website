import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
    default: "State House Boys Senior School",
    template: "%s | State House Boys Senior School",
  },
  description: "Excellence in education - Discipline, Excellence, Leadership. A leading educational institution committed to nurturing future leaders.",
  keywords: ["school", "education", "academics", "admissions", "Kenya"],
  authors: [{ name: "State House Boys Senior School" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "State House Boys Senior School",
    title: "State House Boys Senior School",
    description: "Excellence in education - Discipline, Excellence, Leadership",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "State House Boys Senior School",
    description: "Excellence in education - Discipline, Excellence, Leadership",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logo.png",
    other: [
      {
        rel: "icon",
        url: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
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
        <Header />
        {children}
      </body>
    </html>
  );
}
