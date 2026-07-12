import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://flametechengineering.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FlameTech Engineering | Industrial Burners & Spares Manufacturer",
    template: "%s | FlameTech Engineering",
  },
  description: "B2B manufacturer of high-efficiency industrial gas and oil burners, automatic control panels, and premium AMC service contracts. 470+ spare parts in stock — buy online or request a quote.",
  keywords: [
    "industrial gas burner manufacturer",
    "industrial oil burner manufacturer India",
    "burner spare parts supplier Mumbai",
    "automatic burner control panel",
    "FlameTech Engineering",
    "AMC burner service contract",
    "gas burner for bakery oven",
    "powder coating oven burner",
    "boiler burner manufacturer India",
  ],
  authors: [{ name: "FlameTech Engineering" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "FlameTech Engineering",
    title: "FlameTech Engineering | Industrial Burners & Spares Manufacturer",
    description: "B2B manufacturer of high-efficiency industrial gas and oil burners, automatic control panels, and premium AMC service contracts.",
    images: [{ url: "/images/hero-burner.png", width: 1200, height: 800, alt: "FlameTech Engineering industrial gas burner" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlameTech Engineering | Industrial Burners & Spares Manufacturer",
    description: "B2B manufacturer of high-efficiency industrial gas and oil burners, automatic control panels, and premium AMC service contracts.",
    images: ["/images/hero-burner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FlameTech Engineering",
  alternateName: "FlameTech",
  url: SITE_URL,
  logo: `${SITE_URL}/images/hero-burner.png`,
  description: "Manufacturer of industrial gas and oil burners, automatic control panels, spare parts, and AMC service contracts.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No. 9, Ground Floor, Paradise Apts., 15 Wanja Wadi, Mahim (W)",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400016",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-98695-88728",
      contactType: "sales",
      email: "info@flametechengineering.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-98695-88728",
      contactType: "customer support",
      email: "support@flametechengineering.com",
      areaServed: "IN",
    },
  ],
  sameAs: [],
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
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('flametech-theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#060b13] text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
