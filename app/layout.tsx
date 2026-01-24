import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Vinyl Collection | Manage Your Records",
    template: "%s | Vinyl Collection",
  },
  description: "A modern application to manage your vinyl record collection, integrated with Discogs.",
  metadataBase: new URL("https://vinyl-collection.vercel.app"),
  keywords: ["vinyl", "record collection", "discogs", "music", "album manager"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vinyl-collection.vercel.app",
    title: "Vinyl Collection",
    description: "A modern application to manage your vinyl record collection, integrated with Discogs.",
    siteName: "Vinyl Collection",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinyl Collection",
    description: "A modern application to manage your vinyl record collection, integrated with Discogs.",
  },
  icons: {
    icon: "/vinyl.ico",
    apple: '/vinyl.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-screen-xl mx-auto relative`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Vinyl Collection",
              url: "https://vinyl-collection.vercel.app",
            }),
          }}
        />
        <Header />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
