"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const subtotal = getTotalPrice();
  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingCharge;

  const totalSavings = items.reduce((sum, item) => {
    const discount = item.product.original_price - item.product.price;
    return sum + (discount > 0 ? discount * item.quantity : 0);
  }, 0);

  if (items.length === 0) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--ivory)", paddingTop: "72px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <ShoppingBag
            size={40}
            strokeWidth={1}
            className="mx-auto mb-6"
            style={{ color: "var(--sand)" }}
          />
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "36px",
              color: "var(--noir)",
            }}
          >
            Your cart is empty
          </h1>
          <p
            className="mt-3 mb-10 max-w-sm mx-auto"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "14px",
              color: "var(--stone)",
            }}
          >
            Browse our collection to find something you love.
          </p>
          <Link href="/products" className="btn-primary">
            <span>Start Shopping</span>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-6 lg:px-10 pb-20"
      style={{ backgroundColor: "var(--ivory)", paddingTop: "128px" }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-baseline"
        >
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(36px, 4vw, 52px)",
              color: "var(--noir)",
            }}
          >
            Your Cart
          </h1>
          <span
            className="ml-4"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "18px",
              color: "var(--stone)",
            }}
          >
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT — Cart Items */}
          <div className="flex-1">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.selected_size}-${item.selected_color}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6 py-8"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* Image */}
                <Link
                  href={`/products/${item.product.id}`}
                  className="relative shrink-0 overflow-hidden"
                  style={{
                    width: "100px",
                    height: "128px",
                    backgroundColor: "var(--ivory-deep)",
                  }}
                >
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, var(--ivory-deep), var(--border))" }}
                    >
                      <span
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          fontSize: "32px",
                          fontStyle: "italic",
                          color: "var(--sand)",
                        }}
                      >
                        {item.product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="line-clamp-1 transition-colors"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 400,
                      fontSize: "16px",
                      color: "var(--noir)",
                    }}
                  >
                    {item.product.name}
                  </Link>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--stone)",
                    }}
                  >
                    {item.product.category.replace(/-/g, " ")}
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "13px",
                      color: "var(--stone)",
                    }}
                  >
                    {item.selected_size} · {item.selected_color}
                  </p>
                  <p
                    className="mt-auto"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "var(--noir)",
                    }}
                  >
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Right — Qty + Remove */}
                <div className="flex flex-col items-end justify-between">
                  {/* Qty controls */}
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.selected_size, item.selected_color, item.quantity - 1)
                      }
                      className="flex items-center justify-center transition-colors hover:bg-[var(--ivory-deep)]"
                      style={{ width: "28px", height: "28px", border: "1px solid var(--border)" }}
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      className="flex items-center justify-center"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderTop: "1px solid var(--border)",
                        borderBottom: "1px solid var(--border)",
                        fontFamily: '"Jost", sans-serif',
                        fontWeight: 400,
                        fontSize: "13px",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.selected_size, item.selected_color, Math.min(item.quantity + 1, 10))
                      }
                      className="flex items-center justify-center transition-colors hover:bg-[var(--ivory-deep)]"
                      style={{ width: "28px", height: "28px", border: "1px solid var(--border)" }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product.id, item.selected_size, item.selected_color)}
                    className="transition-colors"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      color: "var(--sand)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--noir)";
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--sand)";
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT — Order Summary */}
          <div style={{ width: "340px" }} className="shrink-0 hidden lg:block">
            <div
              className="sticky"
              style={{
                top: "96px",
                backgroundColor: "var(--ivory-deep)",
                padding: "32px",
              }}
            >
              <h2
                className="pb-6 mb-6"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 500,
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--stone)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--ink)" }}>
                    Subtotal
                  </span>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "14px", color: "var(--noir)" }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--ink)" }}>
                    Shipping
                  </span>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "14px", color: shippingCharge === 0 ? "var(--gold)" : "var(--noir)" }}>
                    {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                  </span>
                </div>
                {shippingCharge > 0 && (
                  <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "var(--stone)" }}>
                    Add {formatPrice(999 - subtotal)} more for free shipping
                  </p>
                )}

                {totalSavings > 0 && (
                  <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "12px", color: "var(--gold)" }}>
                    You&apos;re saving {formatPrice(totalSavings)}
                  </p>
                )}
              </div>

              {/* Total */}
              <div
                className="flex justify-between mt-4 pt-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", textTransform: "uppercase", color: "var(--noir)" }}>
                  Total
                </span>
                <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "20px", color: "var(--noir)" }}>
                  {formatPrice(total)}
                </span>
              </div>

              <Link href="/checkout" className="btn-primary w-full mt-8 text-center block">
                <span>Proceed to Checkout</span>
              </Link>

              {/* Payment icons */}
              <p
                className="text-center mt-4"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "11px",
                  color: "var(--stone)",
                }}
              >
                UPI · Razorpay · Visa · Mastercard
              </p>
            </div>
          </div>

          {/* Mobile summary */}
          <div className="lg:hidden">
            <div
              style={{
                backgroundColor: "var(--ivory-deep)",
                padding: "24px",
              }}
            >
              <div className="flex justify-between mb-4">
                <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", textTransform: "uppercase", color: "var(--noir)" }}>Total</span>
                <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "20px", color: "var(--noir)" }}>{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" className="btn-primary w-full text-center block">
                <span>Proceed to Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
