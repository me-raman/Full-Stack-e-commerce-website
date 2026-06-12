"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSave: () => void;
}

const categories = [
  { label: "Saree", value: "saree" },
  { label: "Lehenga", value: "lehenga" },
  { label: "Kurta Set", value: "kurta-set" },
  { label: "Dupatta", value: "dupatta" },
  { label: "Sherwani", value: "sherwani" },
  { label: "Kurta Pyjama", value: "kurta-pyjama" },
  { label: "Nehru Jacket", value: "nehru-jacket" },
  { label: "Indo-Western", value: "indo-western" },
];

const labelStyle: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 500,
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#888888",
  display: "block",
  marginBottom: "6px",
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: '"Jost", sans-serif',
  fontWeight: 300,
  fontSize: "14px",
  color: "#111111",
  border: "1px solid #E5E5E5",
  padding: "12px 14px",
  borderRadius: 0,
  backgroundColor: "#FFFFFF",
  outline: "none",
  transition: "border-color 0.3s",
};

const hintStyle: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 300,
  fontSize: "11px",
  color: "#888",
  marginTop: "4px",
};

export default function ProductForm({ product, onClose, onSave }: ProductFormProps) {
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    category: "saree",
    gender: "women",
    sizes: "",
    colors: "",
    images: "",
    stock: 0,
    is_featured: false,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        category: product.category,
        gender: product.gender,
        sizes: product.sizes.join(", "),
        colors: product.colors.join(", "),
        images: product.images?.join("\n") || "",
        stock: product.stock,
        is_featured: product.is_featured,
        is_active: product.is_active,
      });
    }
  }, [product]);

  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      original_price: Number(form.original_price) || Number(form.price),
      category: form.category,
      gender: form.gender,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      images: form.images.split("\n").map((u) => u.trim()).filter(Boolean),
      stock: Number(form.stock),
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}
        >
          <h2 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "18px", color: "#111" }}>
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} style={{ color: "#888" }}><X size={18} /></button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Banarasi Silk Saree"
              style={fieldStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
            />
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              style={{ ...fieldStyle, resize: "vertical" } as React.CSSProperties}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input type="number" value={form.price || ""} onChange={(e) => updateField("price", Number(e.target.value))} placeholder="2999" style={fieldStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "#111")} onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")} />
            </div>
            <div>
              <label style={labelStyle}>Original Price (₹)</label>
              <input type="number" value={form.original_price || ""} onChange={(e) => updateField("original_price", Number(e.target.value))} placeholder="4999" style={fieldStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "#111")} onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="appearance-none cursor-pointer" style={fieldStyle}>
                {categories.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Gender *</label>
              <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className="appearance-none cursor-pointer" style={fieldStyle}>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Sizes *</label>
              <input type="text" value={form.sizes} onChange={(e) => updateField("sizes", e.target.value)} placeholder="S, M, L, XL" style={fieldStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "#111")} onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")} />
              <p style={hintStyle}>Comma-separated</p>
            </div>
            <div>
              <label style={labelStyle}>Colors *</label>
              <input type="text" value={form.colors} onChange={(e) => updateField("colors", e.target.value)} placeholder="Red, Blue, Green" style={fieldStyle} onFocus={(e) => (e.currentTarget.style.borderColor = "#111")} onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")} />
              <p style={hintStyle}>Comma-separated</p>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Image URLs</label>
            <textarea
              value={form.images}
              onChange={(e) => updateField("images", e.target.value)}
              placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
              rows={3}
              style={{ ...fieldStyle, resize: "vertical" } as React.CSSProperties}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#111")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
            />
            <p style={hintStyle}>One URL per line</p>
          </div>

          <div>
            <label style={labelStyle}>Stock *</label>
            <input type="number" value={form.stock || ""} onChange={(e) => updateField("stock", Number(e.target.value))} placeholder="50" style={{ ...fieldStyle, maxWidth: "200px" }} onFocus={(e) => (e.currentTarget.style.borderColor = "#111")} onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")} />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => updateField("is_featured", !form.is_featured)}
                className="flex items-center px-0.5 cursor-pointer transition-colors"
                style={{ width: "40px", height: "24px", backgroundColor: form.is_featured ? "#C09A52" : "#E5E5E5", borderRadius: "12px" }}
              >
                <div className="shadow transition-transform" style={{ width: "20px", height: "20px", backgroundColor: "#FFF", borderRadius: "10px", transform: form.is_featured ? "translateX(16px)" : "translateX(0)" }} />
              </div>
              <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#111" }}>Featured</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => updateField("is_active", !form.is_active)}
                className="flex items-center px-0.5 cursor-pointer transition-colors"
                style={{ width: "40px", height: "24px", backgroundColor: form.is_active ? "#1A7A4A" : "#E5E5E5", borderRadius: "12px" }}
              >
                <div className="shadow transition-transform" style={{ width: "20px", height: "20px", backgroundColor: "#FFF", borderRadius: "10px", transform: form.is_active ? "translateX(16px)" : "translateX(0)" }} />
              </div>
              <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#111" }}>Active</span>
            </label>
          </div>

          {error && (
            <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#CC0000", backgroundColor: "#FFF0F0", border: "1px solid #FFCCCC", padding: "10px 14px" }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0" style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
          <button onClick={onClose} style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#888", cursor: "pointer", background: "none", border: "none" }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px", color: "#FFF", backgroundColor: "#111", padding: "10px 24px", border: "none", cursor: "pointer" }}
          >
            {loading ? (<><Loader2 size={14} className="animate-spin" /> Saving...</>) : isEdit ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
