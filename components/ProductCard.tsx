"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const addItem = useCartStore((s) => s.addItem);

  const discount =
    product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  const categoryLabel = product.category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const genderLabel = product.gender === "women" ? "Women" : "Men";

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      setShowSelector(true);
      return;
    }
    addItem(
      product,
      selectedSize || product.sizes[0] || "Free Size",
      selectedColor || product.colors[0] || "Default"
    );
    setShowSelector(false);
    setSelectedSize("");
    setSelectedColor("");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length > 0) {
      setShowSelector(true);
    } else {
      addItem(product, "Free Size", product.colors[0] || "Default");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative"
      >
        {/* Image Area */}
        <Link
          href={`/products/${product.id}`}
          className="block relative overflow-hidden bg-[#EDE8E0]"
          style={{ aspectRatio: "3/4" }}
        >
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={`${product.name} — ${product.category.replace(/-/g, " ")}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top transition-transform duration-[600ms]"
              style={{
                transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
                mixBlendMode: "multiply",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--ivory-deep), var(--border))",
              }}
            >
              <span
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "64px",
                  color: "var(--sand)",
                  fontStyle: "italic",
                }}
              >
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Top-left: Gender badge */}
          <div className="absolute top-3 left-3 z-[2]">
            <span
              style={{
                display: "inline-block",
                backgroundColor: "rgba(15, 15, 13, 0.8)",
                color: "var(--sand)",
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "4px 12px",
              }}
            >
              {genderLabel}
            </span>
          </div>

          {/* Top-right: Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-3 right-3 z-[2] w-8 h-8 flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "rgba(15, 15, 13, 0.4)",
            }}
          >
            <Heart
              size={16}
              className={liked ? "fill-red-500 text-red-500" : "text-white"}
              strokeWidth={1.5}
            />
          </button>

          {/* Bottom: Quick Add overlay (slides up on hover) */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[2] flex items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[400ms]"
            style={{
              height: "56px",
              backgroundColor: "rgba(15, 15, 13, 0.85)",
              transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
            }}
          >
            <button
              onClick={handleQuickAdd}
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--white)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Quick Add
            </button>
          </div>
        </Link>

        {/* Content below image */}
        <div style={{ padding: "16px 4px" }}>
          {/* Category */}
          <p
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--stone)",
            }}
          >
            {categoryLabel}
          </p>

          {/* Product name */}
          <Link href={`/products/${product.id}`}>
            <h3
              className="line-clamp-1 mt-1 transition-colors duration-300"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                fontSize: "15px",
                color: "var(--noir)",
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Price row */}
          <div className="flex items-center gap-3 mt-2">
            <span
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "15px",
                color: "var(--noir)",
              }}
            >
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "13px",
                    color: "var(--sand)",
                    textDecoration: "line-through",
                  }}
                >
                  {formatPrice(product.original_price)}
                </span>
                {discount > 10 && (
                  <span
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "10px",
                      color: "var(--gold)",
                      backgroundColor: "var(--gold-light)",
                      padding: "2px 8px",
                    }}
                  >
                    −{discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Size/Color Selector Modal ─── */}
      {showSelector && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowSelector(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm shadow-2xl p-8"
            style={{ backgroundColor: "var(--ivory)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  fontSize: "22px",
                  fontStyle: "italic",
                  color: "var(--noir)",
                }}
              >
                Select Options
              </h3>
              <button
                onClick={() => setShowSelector(false)}
                className="transition-colors"
                style={{ color: "var(--stone)" }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Size */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <p
                  className="mb-3"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--stone)",
                  }}
                >
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="px-4 py-2 text-sm transition-all border"
                      style={{
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 400,
                        backgroundColor: selectedSize === size ? "var(--noir)" : "transparent",
                        color: selectedSize === size ? "var(--white)" : "var(--noir)",
                        borderColor: selectedSize === size ? "var(--noir)" : "var(--border)",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors.length > 0 && (
              <div className="mb-8">
                <p
                  className="mb-3"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--stone)",
                  }}
                >
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="px-4 py-2 text-sm transition-all border"
                      style={{
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 400,
                        backgroundColor: selectedColor === color ? "var(--noir)" : "transparent",
                        color: selectedColor === color ? "var(--white)" : "var(--noir)",
                        borderColor: selectedColor === color ? "var(--noir)" : "var(--border)",
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!selectedSize && product.sizes.length > 0}
              className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>Add to Cart</span>
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
