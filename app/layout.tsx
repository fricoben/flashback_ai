import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { siteConfig } from "./siteConfig";
import { Navigation } from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: siteConfig.metaTitle,
  description: siteConfig.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* TikTok Pixel Code Start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
  ttq.instance=function(t){
    for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
    return e
  },
  ttq.load=function(e,n){
    var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
    ttq._i=ttq._i||{},
    ttq._i[e]=[],
    ttq._i[e]._u=r,
    ttq._t=ttq._t||{},
    ttq._t[e]=+new Date,
    ttq._o=ttq._o||{},
    ttq._o[e]=n||{};
    n=document.createElement("script"),
    n.type="text/javascript",
    n.async=!0,
    n.src=r+"?sdkid="+e+"&lib="+t;
    e=document.getElementsByTagName("script")[0];
    e.parentNode.insertBefore(n,e)
  };
  ttq.load('D4NVVCRC77UBODKKHHE0');
  ttq.page();
}(window, document, 'ttq');
            `
          }}
        />
        {/* TikTok Pixel Code End */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
