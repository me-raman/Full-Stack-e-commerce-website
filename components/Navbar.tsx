"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";
import clsx from "clsx";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Women", href: "/products?gender=women" },
    { label: "Men", href: "/products?gender=men" },
    { label: "Collections", href: "/products" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      {/* ─── ROW 1: Announcement Bar ─── */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
            style={{ backgroundColor: "var(--noir)" }}
          >
            <div className="h-[36px] flex items-center justify-center px-12 relative">
              <p
                className="text-center"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "var(--sand)",
                }}
              >
                Free shipping on orders above ₹999 across India
              </p>
              <button
                onClick={() => setAnnouncementVisible(false)}
                aria-label="Dismiss announcement"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--sand)] hover:text-white transition-colors"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ROW 2: Main Navbar ─── */}
      <header
        className={clsx(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          announcementVisible ? "top-[36px]" : "top-0"
        )}
        style={{
          transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
          backgroundColor: isScrolled ? "var(--ivory)" : "transparent",
          borderBottom: isScrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="relative flex items-center justify-between h-[72px] md:h-[72px]">

            {/* Left: Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={clsx(
                    "link-underline transition-colors duration-500",
                    isScrolled
                      ? "hover:text-[var(--gold)]"
                      : "hover:text-[var(--gold)]"
                  )}
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: isScrolled ? "var(--ink)" : "var(--white)",
                    transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center: Logo — absolutely centered */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 transition-colors duration-500"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 200,
                fontSize: "22px",
                letterSpacing: "0.35em",
                textTransform: "uppercase" as const,
                color: isScrolled ? "var(--noir)" : "var(--white)",
                transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
              }}
            >
              TILAAK
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-5 ml-auto">
              {/* Mobile: Cart icon (left of hamburger) */}
              <button
                onClick={openDrawer}
                aria-label="Cart"
                className="md:hidden relative transition-colors duration-500"
                style={{ color: isScrolled ? "var(--noir)" : "var(--white)" }}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--gold)",
                      color: "var(--noir)",
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "10px",
                      borderRadius: "50%",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Desktop actions */}
              <button
                aria-label="Search"
                className="hidden md:block transition-colors duration-500"
                style={{ color: isScrolled ? "var(--noir)" : "var(--white)" }}
              >
                <Search size={19} strokeWidth={1.5} />
              </button>

              <button
                onClick={openDrawer}
                aria-label="Cart"
                className="hidden md:block relative transition-colors duration-500"
                style={{ color: isScrolled ? "var(--noir)" : "var(--white)" }}
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 w-4 h-4 flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--gold)",
                      color: "var(--noir)",
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "10px",
                      borderRadius: "50%",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              <Link
                href="/track-order"
                className="hidden md:flex items-center gap-1.5 link-underline transition-colors duration-500"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: isScrolled ? "var(--ink)" : "var(--white)",
                }}
              >
                Track Order
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                className="md:hidden transition-colors duration-500"
                style={{ color: isScrolled ? "var(--noir)" : "var(--white)" }}
              >
                {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Drawer (slides from right) ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[56] w-[85vw] max-w-[360px] flex flex-col"
              style={{ backgroundColor: "var(--ivory)" }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-[60px] border-b" style={{ borderColor: "var(--border)" }}>
                <span
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 200,
                    fontSize: "18px",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase" as const,
                    color: "var(--noir)",
                  }}
                >
                  TILAAK
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{ color: "var(--noir)" }}
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex flex-col px-6 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-5 border-b transition-colors"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "20px",
                      color: "var(--ink)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track-order"
                  onClick={() => setMobileOpen(false)}
                  className="py-5 flex items-center gap-3 border-b transition-colors"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "20px",
                    color: "var(--ink)",
                    borderColor: "var(--border)",
                  }}
                >
                  <Package size={18} strokeWidth={1.5} />
                  Track Order
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openDrawer();
                  }}
                  className="py-5 flex items-center gap-3 text-left transition-colors"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "20px",
                    color: "var(--ink)",
                  }}
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  Cart
                  {totalItems > 0 && (
                    <span
                      className="ml-auto px-2 py-0.5"
                      style={{
                        backgroundColor: "var(--gold)",
                        color: "var(--noir)",
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 500,
                        fontSize: "11px",
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </button>
              </nav>

              {/* Drawer footer */}
              <div className="px-6 py-6 border-t" style={{ borderColor: "var(--border)" }}>
                <p
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "12px",
                    color: "var(--stone)",
                    letterSpacing: "0.05em",
                  }}
                >
                  Mon – Sat, 10AM – 7PM
                </p>
                <a
                  href="mailto:hello@tilaak.com"
                  className="mt-1 block"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "var(--gold)",
                  }}
                >
                  hello@tilaak.com
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
