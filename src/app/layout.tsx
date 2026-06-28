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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-vercel-domain.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "BioStack — Smart Supplement Stack Builder",
  description: "Free supplement stack calculator. Build your personalized vitamin routine, track daily costs, plan course durations and generate your iHerb cart in one click.",
  keywords: [
    "supplement stack builder",
    "iHerb supplement calculator",
    "vitamin stack planner",
    "supplement budget tracker",
    "daily supplement routine",
    "supplement cost calculator",
    "supplement schedule planner",
    "how to build supplement stack",
    "sleep supplement stack",
    "nootropic stack builder",
    "iHerb cart builder",
    "best supplement deals iHerb",
    "magnesium stack",
    "vitamin D stack",
    "how much do supplements cost per day",
    "supplement course duration calculator",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "BioStack — Smart Supplement Stack Builder",
    description: "Free supplement stack calculator. Build your personalized vitamin routine, track daily costs and generate your iHerb cart instantly.",
    type: "website",
    url: baseUrl,
    images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BioStack — Smart Supplement Stack Builder",
    description: "Free supplement stack calculator. Build your personalized vitamin routine and generate your iHerb cart instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
