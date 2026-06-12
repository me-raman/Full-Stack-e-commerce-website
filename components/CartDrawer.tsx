"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import CartItem from "@/components/CartItem";

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 flex flex-col"
            style={{
              backgroundColor: "var(--ivory)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "22px",
                  color: "var(--noir)",
                }}
              >
                Your Selection
              </h2>
              <button
                onClick={closeDrawer}
                className="flex items-center gap-2 transition-colors"
                style={{ color: "var(--stone)" }}
                aria-label="Close cart"
              >
                <span
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Close
                </span>
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <ShoppingBag
                    size={32}
                    strokeWidth={1}
                    style={{ color: "var(--sand)" }}
                  />
                  <p
                    className="mt-5"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: "22px",
                      color: "var(--stone)",
                    }}
                  >
                    Nothing here yet
                  </p>
                  <Link
                    href="/products"
                    onClick={closeDrawer}
                    className="link-underline mt-4 inline-block"
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                    }}
                  >
                    Continue browsing
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product.id}-${item.selected_size}-${item.selected_color}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: "24px 28px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 300,
                      fontSize: "13px",
                      color: "var(--stone)",
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: '"Jost", sans-serif',
                      fontWeight: 500,
                      fontSize: "15px",
                      color: "var(--noir)",
                    }}
                  >
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "11px",
                    color: "var(--stone)",
                  }}
                >
                  Shipping calculated at checkout
                </p>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="btn-primary w-full mt-6 text-center block"
                >
                  <span>Proceed to Checkout</span>
                </Link>

                <button
                  onClick={closeDrawer}
                  className="w-full text-center mt-4 transition-colors"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 300,
                    fontSize: "12px",
                    color: "var(--stone)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
