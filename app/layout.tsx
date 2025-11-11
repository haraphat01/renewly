import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
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
  title: "Dealping - Never Miss a Contract Renewal",
  description: "AI-powered contract management for independent professionals. Track contracts, get automated reminders, and never miss a renewal or rate increase again.",
  keywords: ["contract management", "freelancer tools", "contract reminders", "AI contract tracking", "independent contractor", "contract renewal", "consultant tools", "small business contracts"],
  authors: [{ name: "Dealping" }],
  creator: "Dealping",
  publisher: "Dealping",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://dealping.tech'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://dealping.tech',
    siteName: "Dealping",
    title: "Dealping - Never Miss a Contract Renewal",
    description: "AI-powered contract management for independent professionals. Track contracts, get automated reminders, and never miss a renewal or rate increase again.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dealping - AI-Powered Contract Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dealping - Never Miss a Contract Renewal",
    description: "AI-powered contract management for independent professionals. Track contracts, get automated reminders, and never miss a renewal or rate increase again.",
    images: ["/og-image.png"],
    creator: "@dealping",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
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
        {/* Google Tag Manager */}
        <GoogleAnalytics gaId="G-55BHC7RPBR" />
        {children}
      </body>
    </html>
  );
}
