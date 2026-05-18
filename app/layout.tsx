import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AppHeader from "./_components/AppHeader";
import AppFooter from "./_components/AppFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://promptlab.io.kr";

const siteTitle = "PromptLab - AI 프롬프트 작업실";
const siteDescription =
  "AI 프롬프트를 작성, 저장, 관리하고 SafeCheck로 저장 전 위험 요소를 확인하는 웹 서비스입니다.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(SITE_URL),
  verification: {
    google: "jnR9e_2rD2cYJr5-ZfNaCKWLBgqx9n9i411RoqO2A8s",
    other: {
      "naver-site-verification": "df6d569e5ba268b4baf19c9035c3640d610fefcd",
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: SITE_URL,
    siteName: "PromptLab",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image-v2.png`,
        width: 1200,
        height: 630,
        alt: "PromptLab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [`${SITE_URL}/og-image-v2.png`],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-950">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7T02L3YW4T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7T02L3YW4T');
          `}
        </Script>

        <AppHeader />

        {children}

        <AppFooter />
      </body>
    </html>
  );
}