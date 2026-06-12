"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import RazorpayButton from "@/components/RazorpayButton";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

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

const labelStyle = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 500 as const,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--stone)",
  display: "block",
  marginBottom: "8px",
};

const sectionHeadingStyle = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 500 as const,
  fontSize: "11px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "var(--stone)",
  marginBottom: "24px",
  paddingBottom: "12px",
  borderBottom: "1px solid var(--border)",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const [formData, setFormData] = useState<CheckoutFormData>({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const subtotal = getTotalPrice();
  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingCharge;

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  useEffect(() => {
    const newErrors: Partial<CheckoutFormData> = {};
    let valid = true;

    if (!formData.full_name.trim()) { newErrors.full_name = "Name is required"; valid = false; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required"; valid = false;
    }
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit Indian number required"; valid = false;
    }
    if (!formData.address_line1.trim()) { newErrors.address_line1 = "Address is required"; valid = false; }
    if (!formData.city.trim()) { newErrors.city = "City is required"; valid = false; }
    if (!formData.state) { newErrors.state = "State is required"; valid = false; }
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Valid 6-digit PIN code required"; valid = false;
    }

    setErrors(newErrors);
    setIsFormValid(valid);
  }, [formData]);

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSuccess = (orderId: string, orderNumber: string) => {
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}&orderNumber=${orderNumber}`);
  };

  const handleError = () => {
    alert("Payment failed. Please try again.");
  };

  if (items.length === 0) return null;

  const inputStyle = (field: keyof CheckoutFormData) => ({
    width: "100%",
    padding: "14px 16px",
    fontFamily: '"Jost", sans-serif',
    fontWeight: 300 as const,
    fontSize: "14px",
    color: "var(--noir)",
    backgroundColor: "var(--white)",
    border: `1px solid ${errors[field] && formData[field] ? "#e53e3e" : "var(--border)"}`,
    borderRadius: 0,
    outline: "none",
    transition: "border-color 0.3s",
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--ivory)", paddingTop: "128px", paddingBottom: "80px" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(36px, 4vw, 48px)",
              color: "var(--noir)",
            }}
          >
            Checkout
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "13px",
              color: "var(--stone)",
            }}
          >
            Secure checkout · All payments encrypted
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            {/* Contact */}
            <div className="mb-10">
              <h2 style={sectionHeadingStyle}>Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    placeholder="Enter your full name"
                    style={inputStyle("full_name")}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.full_name && formData.full_name ? "#e53e3e" : "var(--border)")}
                  />
                  {errors.full_name && formData.full_name !== "" && (
                    <p style={{ fontFamily: '"Jost", sans-serif', fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>{errors.full_name}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle("email")}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.email && formData.email ? "#e53e3e" : "var(--border)")}
                  />
                  {errors.email && formData.email !== "" && (
                    <p style={{ fontFamily: '"Jost", sans-serif', fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>{errors.email}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--stone)" }}>+91</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      style={{ ...inputStyle("phone"), paddingLeft: "48px" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone && formData.phone ? "#e53e3e" : "var(--border)")}
                    />
                  </div>
                  {errors.phone && formData.phone !== "" && (
                    <p style={{ fontFamily: '"Jost", sans-serif', fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <h2 style={sectionHeadingStyle}>Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Address Line 1 *</label>
                  <input type="text" value={formData.address_line1} onChange={(e) => updateField("address_line1", e.target.value)} placeholder="House/Flat No., Street Name" style={inputStyle("address_line1")} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                </div>
                <div className="sm:col-span-2">
                  <label style={labelStyle}>Address Line 2</label>
                  <input type="text" value={formData.address_line2} onChange={(e) => updateField("address_line2", e.target.value)} placeholder="Area, Landmark (optional)" style={{ ...inputStyle("address_line2"), border: "1px solid var(--border)" }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Mumbai" style={inputStyle("city")} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                </div>
                <div>
                  <label style={labelStyle}>PIN Code *</label>
                  <input type="text" value={formData.pincode} onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="400001" style={inputStyle("pincode")} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")} onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
                  {errors.pincode && formData.pincode !== "" && (
                    <p style={{ fontFamily: '"Jost", sans-serif', fontSize: "11px", color: "#e53e3e", marginTop: "4px" }}>{errors.pincode}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label style={labelStyle}>State *</label>
                  <div className="relative">
                    <select
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="appearance-none cursor-pointer"
                      style={{ ...inputStyle("state"), paddingRight: "40px" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--noir)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--stone)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Place Order */}
            <div className="lg:hidden mt-10">
              {isFormValid ? (
                <RazorpayButton formData={formData} cartItems={items} subtotal={subtotal} shippingCharge={shippingCharge} total={total} onSuccess={handleSuccess} onError={handleError} />
              ) : (
                <button disabled className="btn-primary w-full opacity-30 cursor-not-allowed">
                  <span>Fill all fields to continue</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* RIGHT — Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ width: "340px" }}
            className="shrink-0 hidden lg:block"
          >
            <div className="sticky" style={{ top: "96px", backgroundColor: "var(--ivory-deep)", padding: "32px" }}>
              <h2 style={{ ...sectionHeadingStyle, marginBottom: "20px" }}>Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selected_size}-${item.selected_color}`} className="flex gap-3">
                    <div className="relative shrink-0 overflow-hidden" style={{ width: "48px", height: "60px", backgroundColor: "var(--ivory)" }}>
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: "var(--border)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "var(--noir)" }}>{item.product.name}</p>
                      <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "var(--stone)" }}>{item.selected_size} · Qty: {item.quantity}</p>
                      <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px", color: "var(--noir)", marginTop: "2px" }}>{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }} className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--ink)" }}>Subtotal</span>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "14px", color: "var(--noir)" }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "14px", color: "var(--ink)" }}>Shipping</span>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "14px", color: shippingCharge === 0 ? "var(--gold)" : "var(--noir)" }}>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
                </div>
                <div className="flex justify-between pt-3 mt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", textTransform: "uppercase", color: "var(--noir)" }}>Total</span>
                  <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "20px", color: "var(--noir)" }}>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6">
                {isFormValid ? (
                  <RazorpayButton formData={formData} cartItems={items} subtotal={subtotal} shippingCharge={shippingCharge} total={total} onSuccess={handleSuccess} onError={handleError} />
                ) : (
                  <button disabled className="btn-primary w-full opacity-30 cursor-not-allowed">
                    <span>Fill all fields to continue</span>
                  </button>
                )}
              </div>

              <p className="text-center mt-4" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "var(--stone)" }}>
                100% Secure Checkout
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
