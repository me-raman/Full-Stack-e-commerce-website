"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  const orderId = searchParams.get("orderId") || "";
  const orderNumber = searchParams.get("orderNumber") || "";
  const router = useRouter();

  useEffect(() => {
    if (!orderId || !orderNumber) {
      router.replace("/");
    }
  }, [orderId, orderNumber, router]);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  if (!orderId || !orderNumber) return null;

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--ivory)", paddingTop: "72px" }}
    >
      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Check animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-8"
        >
          <div
            className="w-20 h-20 flex items-center justify-center mx-auto"
            style={{ backgroundColor: "var(--gold-light)" }}
          >
            <CheckCircle size={40} strokeWidth={1} style={{ color: "var(--gold)" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(28px, 4vw, 40px)",
              color: "var(--noir)",
            }}
          >
            Order Placed Successfully
          </h1>

          {orderNumber && (
            <div className="mt-6 mb-6 py-6" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--stone)" }}>
                Order Number
              </p>
              <p className="mt-2" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "32px", color: "var(--gold)" }}>
                #{orderNumber}
              </p>
            </div>
          )}

          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--stone)" }}>
            A confirmation has been sent to your email address.
          </p>

          <div className="mt-4 mb-10 inline-block" style={{ padding: "10px 20px", backgroundColor: "var(--ivory-deep)" }}>
            <p className="flex items-center gap-2" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "var(--stone)" }}>
              <Package size={16} style={{ color: "var(--gold)" }} />
              Expected Delivery: 5–7 Business Days
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/products" className="btn-primary">
            <span className="flex items-center gap-2"><ShoppingBag size={16} /> Continue Shopping</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "12px", color: "var(--stone)", marginBottom: "8px" }}>
            Need help with your order?
          </p>
          <a
            href="https://wa.me/919820000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
            style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "12px", color: "#25D366" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.121 1.52 5.86L0 24l6.335-1.652A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.645-.497-5.18-1.365l-.37-.22-3.835 1.005 1.025-3.74-.24-.382A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" /></svg>
            Chat with us on WhatsApp
          </a>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--ivory)" }}>
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-6" style={{ width: "80px", height: "80px", backgroundColor: "var(--ivory-deep)" }} />
            <div className="mx-auto mb-4" style={{ height: "32px", width: "256px", backgroundColor: "var(--ivory-deep)" }} />
          </div>
        </main>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
