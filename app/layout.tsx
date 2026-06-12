import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Tilaak | Premium Indian Ethnic Wear — Mumbai",
  description:
    "Shop authentic handcrafted Indian ethnic wear at Tilaak. Sarees, Lehengas, Sherwanis, Kurtas and more. Free shipping above ₹999. Ships across India.",
  keywords: [
    "Indian ethnic wear online",
    "buy saree online Mumbai",
    "lehenga choli online India",
    "sherwani for men India",
    "kurta set women online",
    "handcrafted ethnic wear",
    "Banarasi saree online",
    "Indian wedding wear",
    "ethnic wear Mumbai",
    "tilaak ethnic store",
  ],
  openGraph: {
    title: "Tilaak | Premium Indian Ethnic Wear",
    description:
      "Authentic handcrafted ethnic wear celebrating India's rich textile heritage.",
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tilaak — Wear the Culture, Own the Story",
    description:
      "Shop premium Indian ethnic wear. Free shipping above ₹999.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className="font-body antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-noir focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:tracking-widest2 focus:uppercase"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main">
          {children}
        </main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
