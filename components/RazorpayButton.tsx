"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CartItem } from "@/types";
import { generateOrderNumber } from "@/lib/razorpay";
import { formatPrice } from "@/lib/format";

interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
}

interface RazorpayButtonProps {
  formData: CheckoutFormData;
  cartItems: CartItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  onSuccess: (orderId: string, orderNumber: string) => void;
  onError: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function RazorpayButton({
  formData,
  cartItems,
  subtotal,
  shippingCharge,
  total,
  onSuccess,
  onError,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const loaded = await loadScript();
      if (!loaded) {
        alert("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      const orderNumber = generateOrderNumber();

      // Create Razorpay order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: orderNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Build order items
      const orderItems = cartItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || "",
        price: item.product.price,
        quantity: item.quantity,
        size: item.selected_size,
        color: item.selected_color,
      }));

      // Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Tilaak",
        description: "Ethnic Wear Order",
        order_id: data.orderId,
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#7B2D3E" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  order_number: orderNumber,
                  customer_name: formData.full_name,
                  customer_email: formData.email,
                  customer_phone: formData.phone,
                  shipping_address: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    address_line1: formData.address_line1,
                    address_line2: formData.address_line2,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                  },
                  items: orderItems,
                  subtotal,
                  shipping_charge: shippingCharge,
                  total,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onSuccess(verifyData.orderId, verifyData.orderNumber);
            } else {
              onError();
            }
          } catch {
            onError();
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" /> Processing...
        </>
      ) : (
        <>Place Order — {formatPrice(total)}</>
      )}
    </button>
  );
}
