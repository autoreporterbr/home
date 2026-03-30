import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Auto Repórter – O Portal de Notícias Automotivas do Brasil",
    template: "%s | Auto Repórter",
  },
  description: "Notícias, avaliações, ranking e tudo sobre o mercado automotivo brasileiro. Fique por dentro dos lançamentos, testes e novidades do mundo dos carros.",
  keywords: ["automóveis", "carros", "notícias automotivas", "avaliação de carros", "ranking de carros", "lançamentos", "mercado automotivo"],
  authors: [{ name: "Auto Repórter" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Auto Repórter",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@autoreporter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FFCB08" />
        {/* Google AdSense - Add your publisher ID below */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <div className="auto-bg-texture">
          {children}
        </div>
      </body>
    </html>
  );
}
