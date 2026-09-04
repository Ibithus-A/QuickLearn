import type { Metadata } from "next";
import "./globals.css";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const isConfiguredLocalhost = configuredSiteUrl
  ? /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(configuredSiteUrl)
  : false;
const siteUrl =
  configuredSiteUrl && !(process.env.NODE_ENV === "production" && isConfiguredLocalhost)
    ? configuredSiteUrl
    : process.env.NODE_ENV === "production"
      ? "https://course.excelora.co.uk"
      : "http://localhost:3000";
const title = "Excelora | GCSE & A-Level Maths Tuition";
const description =
  "Structured GCSE and A-Level Maths tuition with interactive lessons, expert guidance and measurable progress towards A/A* results.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Excelora",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Excelora",
    title,
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Excelora structured GCSE and A-Level Maths learning workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
