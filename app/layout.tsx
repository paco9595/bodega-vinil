import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/providers/sonner";
import { ThemeProvider } from "@/providers/themeProvider";
import Sidebar from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased mx-auto relative bg-[var(--bg)] flex flex-col md:grid md:grid-cols-1 ${user ? 'md:grid-cols-[256px_1fr]' : ''}`}
      >
        <ThemeProvider>
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
          {user && <Sidebar />}
          <div className="flex-1 flex flex-col">
            <Toaster />
            <Header />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
