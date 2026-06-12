"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const shopLinks = [
  { label: "New Arrivals", href: "/products" },
  { label: "Women's Wear", href: "/products?gender=women" },
  { label: "Men's Wear", href: "/products?gender=men" },
  { label: "Sarees", href: "/products?category=saree" },
  { label: "Lehengas", href: "/products?category=lehenga" },
  { label: "Sherwanis", href: "/products?category=sherwani" },
];

const helpLinks = [
  { label: "Size Guide", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Return Policy", href: "#" },
  { label: "Track Your Order", href: "/order-confirmation" },
  { label: "Contact Us", href: "#" },
  { label: "FAQs", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--noir)" }}>
      {/* Main Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 200,
                  fontSize: "22px",
                  letterSpacing: "0.3em",
                  color: "var(--white)",
                }}
              >
                TILAAK
              </span>
            </Link>
            <p
              className="mt-1"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "12px",
                color: "var(--gold)",
              }}
            >
              Wear the Culture, Own the Story
            </p>
            <p
              className="mt-5"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 300,
                fontSize: "13px",
                lineHeight: 1.8,
                color: "rgba(181, 175, 166, 0.5)",
              }}
            >
              Celebrating India&apos;s rich textile heritage through handcrafted
              ethnic wear. Shipped across India.
            </p>
            <div className="flex items-center gap-5 mt-6">
              {[
                { label: "Instagram", path: "M2 2h20v20H2zM12 7a5 5 0 110 10 5 5 0 010-10z" },
                { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="transition-colors"
                  style={{ color: "rgba(181, 175, 166, 0.3)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(181, 175, 166, 0.3)")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div>
            <h4
              className="mb-6"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--sand)",
              }}
            >
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "13px",
                      color: "rgba(181, 175, 166, 0.5)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(181, 175, 166, 0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Help */}
          <div>
            <h4
              className="mb-6"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--sand)",
              }}
            >
              Help
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "13px",
                      color: "rgba(181, 175, 166, 0.5)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(181, 175, 166, 0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4
              className="mb-6"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--sand)",
              }}
            >
              Contact
            </h4>
            <ul className="space-y-4" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "rgba(181, 175, 166, 0.5)" }}>
              <li className="flex items-start gap-3">
                <Phone size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(181, 175, 166, 0.3)" }} />
                <span>+91 98200 00000</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(181, 175, 166, 0.3)" }} />
                <span>hello@tilaak.in</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(181, 175, 166, 0.3)" }} />
                <span>Colaba, Mumbai,<br />Maharashtra 400001</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(181, 175, 166, 0.3)" }} />
                <span>Mon–Sat: 10AM–7PM</span>
              </li>
              <li>
                <a
                  href="https://wa.me/919820000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 transition-colors"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#25D366",
                    border: "1px solid rgba(37, 211, 102, 0.3)",
                    padding: "8px 14px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.121 1.52 5.86L0 24l6.335-1.652A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.645-.497-5.18-1.365l-.37-.22-3.835 1.005 1.025-3.74-.24-.382A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" /></svg>
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid rgba(181, 175, 166, 0.1)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
          <div
            className="flex flex-col lg:flex-row items-center justify-between gap-4"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "11px",
              color: "rgba(181, 175, 166, 0.3)",
            }}
          >
            <p>© 2025 Tilaak. All rights reserved. | Mumbai, India</p>
            <p style={{ color: "rgba(181, 175, 166, 0.4)" }}>Made with ❤️ in India</p>
            <div className="flex flex-col items-center lg:items-end gap-3">
              <div className="flex items-center gap-3">
                <Link href="#" className="transition-colors hover:text-[var(--sand)]">Privacy Policy</Link>
                <span>·</span>
                <Link href="#" className="transition-colors hover:text-[var(--sand)]">Terms</Link>
                <span>·</span>
                <Link href="#" className="transition-colors hover:text-[var(--sand)]">Shipping Policy</Link>
              </div>
              <div className="flex items-center gap-2">
                {["Visa", "Mastercard", "UPI", "Razorpay"].map((name) => (
                  <span
                    key={name}
                    className="px-2 py-0.5"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(181, 175, 166, 0.4)",
                      border: "1px solid rgba(181, 175, 166, 0.15)",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
