"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

/* ─── Animation variants ─── */
const stagger = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.76, 0, 0.24, 1] },
  }),
};

/* ─── Category data ─── */
const categories = [
  {
    name: "Sarees",
    count: "12",
    href: "/products?category=saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    bgPosition: "center",
    label: "Womenswear",
  },
  {
    name: "Lehengas",
    count: "8",
    href: "/products?category=lehenga",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80",
    bgPosition: "center top",
    label: "Womenswear",
  },
  {
    name: "Sherwanis",
    count: "10",
    href: "/products?category=sherwani",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    bgPosition: "center",
    label: "Menswear",
  },
  {
    name: "Kurtas",
    count: "15",
    href: "/products?category=kurta-pyjama",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
    bgPosition: "center",
    label: "Menswear",
  },
];

/* ─── Testimonials data ─── */
const testimonials = [
  {
    text: "I wore this saree to my cousin's wedding in Jaipur and received so many compliments. The zari work is absolutely stunning and the fabric feels like pure luxury.",
    author: "Anjali Verma",
    service: "Banarasi Saree",
  },
  {
    text: "Ordered the ivory sherwani for my brother's wedding and it was perfect. The embroidery quality is exceptional. The team helped me with sizing over WhatsApp.",
    author: "Vikram Singh",
    service: "Sherwani",
  },
  {
    text: "The bridal lehenga exceeded all my expectations. Rich fabric, beautiful embroidery and it arrived beautifully packed. Tilaak has become my go-to store.",
    author: "Meera Pillai",
    service: "Lehenga",
  },
];

/* ═══════════════════════════════════════════ */
/*               HOME PAGE                    */
/* ═══════════════════════════════════════════ */

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(8);
      if (data) setFeaturedProducts(data as Product[]);
    }
    fetchFeatured();
  }, []);

  // Testimonial auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollCategories = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
          ═══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-grain"
        style={{ backgroundColor: "var(--noir)" }}
      >
        {/* Grain texture overlay via inline style (the CSS class adds ::before) */}
        <style jsx>{`
          .hero-grain::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
            opacity: 0.35;
            pointer-events: none;
            z-index: 1;
          }
        `}</style>

        {/* Hero content */}
        <div className="relative z-[2] flex flex-col items-center text-center px-6 pt-32 pb-20 max-w-4xl mx-auto">
          {/* 1. Section label */}
          <motion.p
            custom={0}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="section-label mb-8"
          >
            New Collection · 2025
          </motion.p>

          {/* 2. Giant headline */}
          <motion.h1
            custom={1}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <span
              className="block"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(64px, 8vw, 120px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--white)",
              }}
            >
              Wear the
            </span>
            <span
              className="block"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(64px, 8vw, 120px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--gold)",
              }}
            >
              Culture
            </span>
          </motion.h1>

          {/* 3. Thin horizontal rule */}
          <motion.div
            custom={2}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="my-8"
            style={{
              width: "60px",
              height: "1px",
              backgroundColor: "var(--gold)",
            }}
          />

          {/* 4. Subtext */}
          <motion.p
            custom={3}
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "16px",
              lineHeight: 1.9,
              color: "var(--sand)",
              maxWidth: "480px",
            }}
          >
            Handcrafted ethnic wear celebrating India&apos;s textile heritage.
            Curated for the modern Indian wardrobe.
          </motion.p>

          {/* 5. CTA buttons */}
          <motion.div
            custom={4}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 mt-10"
          >
            <Link
              href="/products?gender=women"
              className="btn-primary"
            >
              <span>Shop Women</span>
            </Link>
            <Link
              href="/products?gender=men"
              className="btn-ghost btn-ghost-light"
            >
              <span>Shop Men</span>
            </Link>
          </motion.div>
        </div>

        {/* 6. Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-3">
          <motion.div
            animate={{ height: [48, 24, 48] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "2px",
              backgroundColor: "rgba(181, 175, 166, 0.4)",
            }}
          />
          <span
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(181, 175, 166, 0.6)",
            }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — EDITORIAL STATEMENT
          ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--ivory)", padding: "128px 0" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
            {/* Left side (60%) */}
            <div className="relative lg:w-[60%]">
              {/* Decorative number */}
              <span
                className="absolute -top-10 -left-2 select-none pointer-events-none"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "140px",
                  lineHeight: 1,
                  color: "var(--border)",
                }}
              >
                01
              </span>

              <div className="relative z-[1] pt-16">
                <h2
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(36px, 4vw, 52px)",
                    lineHeight: 1.2,
                    color: "var(--noir)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {"Rooted in Craft,\nDressed for Today"}
                </h2>

                <p
                  className="mt-8"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "16px",
                    lineHeight: 1.9,
                    color: "var(--stone)",
                    maxWidth: "480px",
                  }}
                >
                  Every piece at Tilaak is born from the hands of India&apos;s
                  finest artisans — from the silk looms of Varanasi to the
                  embroidery workshops of Lucknow. We bridge generations of
                  craft with the modern Indian wardrobe.
                </p>

                <Link
                  href="/about"
                  className="link-underline inline-block mt-8"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "12px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                  }}
                >
                  Our Story →
                </Link>
              </div>
            </div>

            {/* Right side (40%) — Abstract CSS/SVG artwork */}
            <div className="lg:w-[40%] flex items-center justify-center">
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                  className="relative w-64 h-64"
                >
                  <svg
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* Outer thin circle */}
                    <circle cx="100" cy="100" r="90" stroke="#C09A52" strokeWidth="0.5" />
                    {/* Middle circle */}
                    <circle cx="100" cy="100" r="65" stroke="#DDD7CE" strokeWidth="0.5" />
                    {/* Inner circle */}
                    <circle cx="100" cy="100" r="40" stroke="#C09A52" strokeWidth="0.5" />
                    {/* 4 cardinal dots */}
                    <circle cx="100" cy="10" r="2" fill="#C09A52" />
                    <circle cx="100" cy="190" r="2" fill="#C09A52" />
                    <circle cx="10" cy="100" r="2" fill="#C09A52" />
                    <circle cx="190" cy="100" r="2" fill="#C09A52" />
                    {/* Cross lines */}
                    <line x1="100" y1="35" x2="100" y2="165" stroke="#DDD7CE" strokeWidth="0.5" />
                    <line x1="35" y1="100" x2="165" y2="100" stroke="#DDD7CE" strokeWidth="0.5" />
                    {/* Small center dot */}
                    <circle cx="100" cy="100" r="3" fill="#C09A52" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — HORIZONTAL SCROLL CATEGORIES
          ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--noir)", padding: "96px 0" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Header row */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-3">Explore</p>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(36px, 4vw, 48px)",
                  color: "var(--white)",
                }}
              >
                Shop by World
              </h2>
            </div>

            {/* Desktop scroll arrows */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollCategories("left")}
                className="w-10 h-10 flex items-center justify-center border transition-colors hover:bg-white/10"
                style={{ borderColor: "var(--border-dark)", color: "var(--sand)" }}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => scrollCategories("right")}
                className="w-10 h-10 flex items-center justify-center border transition-colors hover:bg-white/10"
                style={{ borderColor: "var(--border-dark)", color: "var(--sand)" }}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Horizontal scroll strip */}
          <div
            ref={scrollRef}
            className="flex gap-[2px] overflow-x-auto pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar { display: none; }
            `}</style>
            {categories.map((panel) => (
              <Link
                key={panel.name}
                href={panel.href}
                className="relative flex-shrink-0 overflow-hidden cursor-pointer group"
                style={{
                  minWidth: "280px",
                  height: "480px",
                  backgroundImage: `url("${panel.image}")`,
                  backgroundSize: "cover",
                  backgroundPosition: panel.bgPosition,
                }}
              >
                {/* Dark gradient overlay — stronger at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-all duration-500 z-[1]" />

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <p className="section-label text-[var(--gold)] mb-2">
                    {panel.label}
                  </p>
                  <h3 className="font-display italic text-white text-3xl font-normal mb-1 group-hover:text-[var(--gold)] transition-colors duration-300">
                    {panel.name}
                  </h3>
                  <p className="text-white/50 text-xs font-body font-light tracking-widest uppercase mb-4">
                    {panel.count} pieces
                  </p>
                  <div className="flex items-center gap-2 text-[var(--gold)]">
                    <span className="text-xs font-body font-medium uppercase tracking-widest">
                      Explore
                    </span>
                    <ArrowRight size={14} />
                  </div>
                </div>

                {/* Hover: subtle image zoom */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${panel.image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: panel.bgPosition,
                    zIndex: 0,
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — FEATURED PRODUCTS (ASYMMETRIC)
          ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--ivory)", padding: "96px 0" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="section-label mb-3">Featured</p>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(36px, 4vw, 48px)",
                  color: "var(--noir)",
                }}
              >
                Handpicked for You
              </h2>
            </div>
            <Link
              href="/products"
              className="link-underline hidden sm:inline-block"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              View All →
            </Link>
          </div>

          {/* Asymmetric grid */}
          {featuredProducts.length > 0 ? (
            <>
              {/* Desktop: asymmetric CSS grid */}
              <div
                className="hidden lg:grid gap-6"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gridTemplateRows: "auto auto",
                }}
              >
                {featuredProducts[0] && (
                  <div style={{ gridColumn: "1 / 2", gridRow: "1 / 2" }}>
                    <ProductCard product={featuredProducts[0]} index={0} />
                  </div>
                )}
                {featuredProducts[1] && (
                  <div style={{ gridColumn: "2 / 4", gridRow: "1 / 2" }}>
                    <ProductCard product={featuredProducts[1]} index={1} />
                  </div>
                )}
                {featuredProducts[2] && (
                  <div style={{ gridColumn: "1 / 3", gridRow: "2 / 3" }}>
                    <ProductCard product={featuredProducts[2]} index={2} />
                  </div>
                )}
                {featuredProducts[3] && (
                  <div style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}>
                    <ProductCard product={featuredProducts[3]} index={3} />
                  </div>
                )}
              </div>

              {/* Mobile/Tablet: simple 2-col grid with remaining products */}
              <div className="grid grid-cols-2 gap-4 lg:hidden">
                {featuredProducts.slice(0, 4).map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse"
                  style={{
                    aspectRatio: "3/4",
                    backgroundColor: "var(--ivory-deep)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Mobile "View All" link */}
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/products"
              className="link-underline inline-block"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              View All →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — FULL-WIDTH DARK BANNER
          ═══════════════════════════════════════════ */}
      <section
        className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16 py-16 lg:py-0"
        style={{
          backgroundColor: "var(--charcoal)",
          minHeight: "280px",
        }}
      >
        {/* Left: headline */}
        <div className="mb-10 lg:mb-0">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(32px, 4vw, 52px)",
              color: "var(--white)",
              lineHeight: 1.15,
            }}
          >
            Handcrafted in India
          </h2>
          <p
            className="mt-3"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "14px",
              color: "var(--sand)",
            }}
          >
            By artisans across Maharashtra, Rajasthan & Varanasi
          </p>
        </div>

        {/* Right: three stats */}
        <div className="flex items-center gap-8 lg:gap-12">
          {[
            { number: "3,200+", label: "Customers" },
            { number: "15+", label: "Years" },
            { number: "100%", label: "Authentic" },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center gap-8 lg:gap-12">
              <div className="text-center">
                <p
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 400,
                    fontSize: "clamp(28px, 3vw, 36px)",
                    color: "var(--gold)",
                    lineHeight: 1.2,
                  }}
                >
                  {stat.number}
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--sand)",
                  }}
                >
                  {stat.label}
                </p>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    width: "1px",
                    height: "48px",
                    backgroundColor: "var(--border-dark)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section style={{ backgroundColor: "var(--ivory-deep)", padding: "96px 0" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="relative max-w-[700px] mx-auto text-center min-h-[300px]">
            {/* Giant quote mark */}
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "120px",
                lineHeight: 1,
                color: "var(--border)",
              }}
            >
              &ldquo;
            </span>

            {/* Quote content */}
            <div className="relative z-[1] pt-16">
              <p
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  lineHeight: 1.6,
                  color: "var(--noir)",
                  maxWidth: "640px",
                  margin: "0 auto",
                }}
              >
                &ldquo;{testimonials[activeTestimonial].text}&rdquo;
              </p>

              <p
                className="mt-8"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 500,
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--stone)",
                }}
              >
                {testimonials[activeTestimonial].author}
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "12px",
                  color: "var(--gold)",
                }}
              >
                {testimonials[activeTestimonial].service}
              </p>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: i === activeTestimonial ? "24px" : "8px",
                    height: "8px",
                    backgroundColor: i === activeTestimonial ? "var(--gold)" : "transparent",
                    border: i === activeTestimonial ? "none" : "1px solid var(--sand)",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7 — NEWSLETTER
          ═══════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: "var(--noir)" }}>
        <div className="max-w-[560px] mx-auto px-6 text-center">
          <p className="section-label mb-6">Stay Close</p>

          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(36px, 4vw, 48px)",
              color: "var(--white)",
              lineHeight: 1.15,
            }}
          >
            Be the First to Know
          </h2>

          <p
            className="mt-4 mb-10"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "14px",
              lineHeight: 1.8,
              color: "var(--sand)",
            }}
          >
            New arrivals, festive edits, and artisan stories.
            <br />
            No spam. Only things worth reading.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8"
            >
              <p
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "0.1em",
                  color: "var(--gold)",
                }}
              >
                You&apos;re in.
              </p>
              <p
                className="mt-2"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "var(--sand)",
                }}
              >
                Check your inbox for your welcome note.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-end">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 bg-transparent border-0 border-b outline-none transition-colors focus:border-[var(--gold)]"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "14px",
                  color: "var(--white)",
                  borderBottomWidth: "1px",
                  borderBottomColor: "var(--border-dark)",
                  padding: "12px 0",
                  borderRadius: 0,
                }}
              />
              <button type="submit" className="btn-primary ml-4 shrink-0">
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
