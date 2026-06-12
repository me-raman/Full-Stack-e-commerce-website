"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Star,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [mainImage, setMainImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(data as Product);

      const { data: related } = await supabase
        .from("products")
        .select("*")
        .eq("category", (data as Product).category)
        .eq("is_active", true)
        .neq("id", id)
        .limit(4);

      if (related) setRelatedProducts(related as Product[]);
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product || !selectedSize || !selectedColor) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor);
    }
    window.location.href = "/cart";
  };

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", backgroundColor: "var(--ivory)", paddingTop: "96px" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
            <div className="animate-pulse" style={{ aspectRatio: "3/4", backgroundColor: "var(--ivory-deep)" }} />
            <div className="space-y-6 py-4">
              <div style={{ height: "12px", width: "30%", backgroundColor: "var(--border)" }} />
              <div style={{ height: "32px", width: "70%", backgroundColor: "var(--border)" }} />
              <div style={{ height: "20px", width: "25%", backgroundColor: "var(--border)" }} />
              <div style={{ height: "100px", backgroundColor: "var(--border)" }} />
              <div style={{ height: "52px", backgroundColor: "var(--border)" }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--ivory)", paddingTop: "72px" }}>
        <div className="text-center">
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontStyle: "italic", fontSize: "36px", color: "var(--noir)", marginBottom: "16px" }}>
            Product Not Found
          </h1>
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--stone)", marginBottom: "24px" }}>
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/products" className="btn-primary"><span>Browse Products</span></Link>
        </div>
      </main>
    );
  }

  const discount = product.original_price > product.price ? product.original_price - product.price : 0;
  const categoryLabel = product.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const canAddToCart = selectedSize && selectedColor;

  const accordionItems = [
    { title: "Product Description", content: product.description },
    { title: "Fabric & Care", content: "Dry clean recommended. Store in a cool dry place. Avoid direct sunlight to preserve color vibrancy. Iron on low heat if needed." },
    { title: "Shipping & Returns", content: "Free shipping above ₹999. Delivered in 5-7 business days across India. 15-day easy returns — no questions asked. Items must be unused with original tags attached." },
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--ivory)", paddingTop: "96px", paddingBottom: "80px" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 mb-8 flex-wrap"
          style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "12px", color: "var(--stone)" }}
        >
          <Link href="/" className="hover:text-[var(--noir)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[var(--noir)] transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-[var(--noir)] transition-colors">{categoryLabel}</Link>
          <span>/</span>
          <span style={{ color: "var(--noir)", fontWeight: 400 }} className="line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          {/* LEFT — Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative overflow-hidden group cursor-crosshair" style={{ aspectRatio: "3/4", backgroundColor: "var(--ivory-deep)" }}>
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[mainImage] || product.images[0]}
                  alt={`${product.name} — ${product.category.replace(/-/g, " ")}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700"
                  style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--ivory-deep), var(--border))" }}>
                  <span style={{ fontFamily: '"Playfair Display", serif', fontSize: "96px", color: "var(--sand)", fontStyle: "italic" }}>{product.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className="relative shrink-0 overflow-hidden transition-all"
                    style={{
                      width: "72px",
                      height: "90px",
                      border: mainImage === i ? "2px solid var(--noir)" : "1px solid var(--border)",
                      opacity: mainImage === i ? 1 : 0.6,
                    }}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="72px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT — Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="py-2">
            {/* Category */}
            <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--stone)" }}>
              {categoryLabel}
            </span>

            {/* Name */}
            <h1 className="mt-3" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.2, color: "var(--noir)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < 4 ? "fill-[var(--gold)] text-[var(--gold)]" : "fill-[var(--sand)] text-[var(--sand)]"} />
                ))}
              </div>
              <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "var(--noir)" }}>4.8</span>
              <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "12px", color: "var(--stone)" }}>(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3 flex-wrap">
              <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "28px", color: "var(--noir)" }}>
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "16px", color: "var(--sand)", textDecoration: "line-through" }}>
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="px-2 py-0.5" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", color: "var(--gold)", backgroundColor: "var(--gold-light)" }}>
                    Save {formatPrice(discount)}
                  </span>
                </>
              )}
            </div>

            <div className="my-8" style={{ borderTop: "1px solid var(--border)" }} />

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--stone)" }}>Select Size</span>
                <button onClick={() => setShowSizeGuide(true)} className="link-underline" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)" }}>
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-5 py-2.5 transition-all"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 400,
                      fontSize: "13px",
                      backgroundColor: selectedSize === size ? "var(--noir)" : "transparent",
                      color: selectedSize === size ? "var(--white)" : "var(--noir)",
                      border: `1px solid ${selectedSize === size ? "var(--noir)" : "var(--border)"}`,
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <span className="block mb-3" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--stone)" }}>
                Select Color
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="px-5 py-2.5 transition-all"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 400,
                      fontSize: "13px",
                      backgroundColor: selectedColor === color ? "var(--noir)" : "transparent",
                      color: selectedColor === color ? "var(--white)" : "var(--noir)",
                      border: `1px solid ${selectedColor === color ? "var(--noir)" : "var(--border)"}`,
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="block mb-3" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--stone)" }}>Quantity</span>
              <div className="inline-flex items-center">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex items-center justify-center transition-colors hover:bg-[var(--ivory-deep)]" style={{ width: "40px", height: "40px", border: "1px solid var(--border)" }}><Minus size={14} /></button>
                <span className="flex items-center justify-center" style={{ width: "40px", height: "40px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "14px" }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="flex items-center justify-center transition-colors hover:bg-[var(--ivory-deep)]" style={{ width: "40px", height: "40px", border: "1px solid var(--border)" }}><Plus size={14} /></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <div className="relative group">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`btn-primary w-full ${!canAddToCart ? "opacity-30 cursor-not-allowed" : ""} ${addedToCart ? "!bg-[#1A7A4A]" : ""}`}
                  style={addedToCart ? { backgroundColor: "#1A7A4A" } : undefined}
                >
                  <span className="flex items-center justify-center gap-2">
                    {addedToCart ? (<><Check size={16} /> Added to Cart!</>) : (<><ShoppingBag size={16} /> Add to Cart</>)}
                  </span>
                </button>
                {!canAddToCart && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ backgroundColor: "var(--noir)", color: "var(--white)", fontFamily: '"Jost", sans-serif', fontWeight: 300 }}>
                    Please select size and color
                  </div>
                )}
              </div>
              <button
                onClick={handleBuyNow}
                disabled={!canAddToCart}
                className={`btn-ghost w-full ${!canAddToCart ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                <span>Buy Now</span>
              </button>
            </div>

            <div className="my-8" style={{ borderTop: "1px solid var(--border)" }} />

            {/* Accordion */}
            <div className="space-y-0">
              {accordionItems.map((item, i) => (
                <div key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <button onClick={() => setOpenAccordion(openAccordion === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                    <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--noir)" }}>{item.title}</span>
                    <ChevronDown size={14} className={`transition-transform ${openAccordion === i ? "rotate-180" : ""}`} style={{ color: "var(--stone)" }} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <p className="pb-4" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", lineHeight: 1.8, color: "var(--stone)" }}>{item.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 36px)", color: "var(--noir)", marginBottom: "32px" }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
              {relatedProducts.map((p, i) => (<ProductCard key={p.id} product={p} index={i} />))}
            </div>
          </section>
        )}
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSizeGuide(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 sm:w-full sm:max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl"
              style={{ backgroundColor: "var(--ivory)" }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 400, fontStyle: "italic", fontSize: "22px", color: "var(--noir)" }}>Size Guide</h3>
                  <button onClick={() => setShowSizeGuide(false)} style={{ color: "var(--stone)" }}><X size={18} strokeWidth={1.5} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        {["Size", "Bust (in)", "Waist (in)", "Hip (in)"].map((h) => (
                          <th key={h} className="text-left py-3" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--stone)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[["XS","32","26","35"],["S","34","28","37"],["M","36","30","39"],["L","38","32","41"],["XL","40","34","43"],["XXL","42","36","45"],["3XL","44","38","47"]].map(([size, bust, waist, hip]) => (
                        <tr key={size} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td className="py-2.5" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "var(--noir)" }}>{size}</td>
                          <td className="py-2.5" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "var(--stone)" }}>{bust}</td>
                          <td className="py-2.5" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "var(--stone)" }}>{waist}</td>
                          <td className="py-2.5" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "var(--stone)" }}>{hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "var(--stone)" }}>
                  Measurements are in inches. For &quot;Free Size&quot; items, one size fits most (bust 32–40). Contact us on WhatsApp for sizing help.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
