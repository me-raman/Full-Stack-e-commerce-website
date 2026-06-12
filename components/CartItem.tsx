"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4"
      style={{
        padding: "24px 28px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Image */}
      <Link
        href={`/products/${item.product.id}`}
        className="relative shrink-0 overflow-hidden"
        style={{
          width: "72px",
          height: "90px",
          backgroundColor: "var(--ivory-deep)",
        }}
      >
        {item.product.images && item.product.images.length > 0 ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            sizes="72px"
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
                fontSize: "24px",
                color: "var(--sand)",
                fontStyle: "italic",
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
          className="line-clamp-1 transition-colors duration-300"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400,
            fontSize: "14px",
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
            color: "var(--stone)",
          }}
        >
          {item.selected_size} · {item.selected_color}
        </p>
        <p
          className="mt-1"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 500,
            fontSize: "14px",
            color: "var(--noir)",
          }}
        >
          {formatPrice(item.product.price)}
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls — sharp squares */}
          <div className="flex items-center">
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selected_size,
                  item.selected_color,
                  item.quantity - 1
                )
              }
              className="flex items-center justify-center transition-colors hover:bg-[var(--ivory-deep)]"
              style={{
                width: "28px",
                height: "28px",
                border: "1px solid var(--border)",
              }}
              aria-label="Decrease quantity"
            >
              <Minus size={12} style={{ color: "var(--noir)" }} />
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
                color: "var(--noir)",
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(
                  item.product.id,
                  item.selected_size,
                  item.selected_color,
                  Math.min(item.quantity + 1, 10)
                )
              }
              className="flex items-center justify-center transition-colors hover:bg-[var(--ivory-deep)]"
              style={{
                width: "28px",
                height: "28px",
                border: "1px solid var(--border)",
              }}
              aria-label="Increase quantity"
            >
              <Plus size={12} style={{ color: "var(--noir)" }} />
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() =>
              removeItem(item.product.id, item.selected_size, item.selected_color)
            }
            className="transition-colors"
            style={{ color: "var(--sand)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--noir)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--sand)")}
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
