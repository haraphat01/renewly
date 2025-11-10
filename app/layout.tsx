import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','G-55BHC7RPBR');
            `,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-55BHC7RPBR"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
