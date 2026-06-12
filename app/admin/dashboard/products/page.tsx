"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { formatPrice } from "@/lib/format";
import { Product } from "@/types";

const PER_PAGE = 10;

const thStyle: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 500,
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#888888",
  backgroundColor: "#F8F8F8",
  borderBottom: "1px solid #E5E5E5",
  padding: "12px 16px",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 300,
  fontSize: "13px",
  color: "#111111",
  padding: "14px 16px",
  borderBottom: "1px solid #F0F0F0",
};

const inputStyle: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 300,
  fontSize: "13px",
  color: "#111111",
  border: "1px solid #E5E5E5",
  padding: "10px 14px",
  borderRadius: 0,
  backgroundColor: "#FFFFFF",
  outline: "none",
  cursor: "pointer",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterActive, setFilterActive] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("tilaak-admin-token");
    if (token !== "tilaak-admin-authenticated") {
      router.push("/admin");
      return;
    }
    setAuthed(true);
  }, [router]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed, fetchProducts]);

  useEffect(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filterGender) result = result.filter((p) => p.gender === filterGender);
    if (filterCategory) result = result.filter((p) => p.category === filterCategory);
    if (filterActive === "true") result = result.filter((p) => p.is_active);
    if (filterActive === "false") result = result.filter((p) => !p.is_active);
    setFiltered(result);
    setPage(1);
  }, [products, search, filterGender, filterCategory, filterActive]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginatedProducts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !product.is_active }),
      });
      fetchProducts();
    } catch {
      console.error("Failed to toggle active status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      console.error("Failed to delete product");
    }
  };

  if (!authed) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <AdminSidebar />
      <main style={{ marginLeft: "256px", padding: "32px", minHeight: "100vh" }}>
        <AdminHeader title={`Products (${filtered.length})`} subtitle="Manage your product catalog" />

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 mt-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#888" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." style={{ ...inputStyle, width: "100%", paddingLeft: "36px", cursor: "text" }} />
          </div>

          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="appearance-none" style={inputStyle}>
            <option value="">All Genders</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="appearance-none" style={inputStyle}>
            <option value="">All Categories</option>
            <option value="saree">Saree</option>
            <option value="lehenga">Lehenga</option>
            <option value="kurta-set">Kurta Set</option>
            <option value="dupatta">Dupatta</option>
            <option value="sherwani">Sherwani</option>
            <option value="kurta-pyjama">Kurta Pyjama</option>
            <option value="nehru-jacket">Nehru Jacket</option>
            <option value="indo-western">Indo-Western</option>
          </select>

          <select value={filterActive} onChange={(e) => setFilterActive(e.target.value as "" | "true" | "false")} className="appearance-none" style={inputStyle}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            onClick={() => { setEditProduct(undefined); setShowForm(true); }}
            className="ml-auto flex items-center gap-2 transition-colors"
            style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px",
              color: "#FFFFFF", padding: "10px 20px", backgroundColor: "#111111", border: "none", cursor: "pointer",
            }}
          >
            <Plus size={14} /> Add Product
          </button>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", overflow: "hidden" }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin" style={{ color: "#C09A52" }} />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888" }}>No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={thStyle}>Image</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Gender</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Stock</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={tdStyle}>
                        <div className="relative overflow-hidden" style={{ width: "40px", height: "50px", backgroundColor: "#F8F8F8" }}>
                          {product.images && product.images.length > 0 ? (
                            <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5F5F5, #E5E5E5)" }}>
                              <span style={{ fontFamily: '"Jost", sans-serif', fontSize: "12px", color: "#888" }}>{product.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 400, maxWidth: "200px" }}><span className="line-clamp-1">{product.name}</span></td>
                      <td style={tdStyle}>
                        <span className="inline-block px-3 py-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", color: "#C09A52", backgroundColor: "rgba(192,154,82,0.1)", border: "1px solid rgba(192,154,82,0.2)", textTransform: "capitalize" }}>
                          {product.category.replace(/-/g, " ")}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span className="inline-block px-3 py-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", color: "#111", backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0", textTransform: "capitalize" }}>
                          {product.gender}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div>
                          <span style={{ fontWeight: 500 }}>{formatPrice(product.price)}</span>
                          {product.original_price > product.price && (
                            <span style={{ fontSize: "11px", color: "#888", textDecoration: "line-through", marginLeft: "6px" }}>{formatPrice(product.original_price)}</span>
                          )}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500, color: product.stock < 5 ? "#CC0000" : "#111" }}>{product.stock}</span>
                      </td>
                      <td style={tdStyle}>
                        <div
                          onClick={() => handleToggleActive(product)}
                          className="flex items-center px-0.5 cursor-pointer transition-colors"
                          style={{
                            width: "40px", height: "24px",
                            backgroundColor: product.is_active ? "#1A7A4A" : "#E5E5E5",
                            borderRadius: "12px",
                          }}
                        >
                          <div
                            className="shadow transition-transform"
                            style={{
                              width: "20px", height: "20px",
                              backgroundColor: "#FFF",
                              borderRadius: "10px",
                              transform: product.is_active ? "translateX(16px)" : "translateX(0)",
                            }}
                          />
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditProduct(product); setShowForm(true); }}
                            className="flex items-center gap-1 transition-colors p-2"
                            style={{ color: "#888" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="flex items-center gap-1 transition-colors p-2"
                            style={{ color: "#888" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#CC0000")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid #E5E5E5" }}>
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888" }}>Page {page} of {totalPages}</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 disabled:opacity-30" style={{ border: "1px solid #E5E5E5" }}><ChevronLeft size={14} /></button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 disabled:opacity-30" style={{ border: "1px solid #E5E5E5" }}><ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <ProductForm
            product={editProduct}
            onClose={() => { setShowForm(false); setEditProduct(undefined); }}
            onSave={fetchProducts}
          />
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm shadow-2xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", padding: "32px" }}>
              <h3 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "18px", color: "#111", marginBottom: "8px" }}>Delete Product</h3>
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888", marginBottom: "24px" }}>Are you sure? This action cannot be undone.</p>
              <div className="flex items-center gap-3 justify-end">
                <button onClick={() => setDeleteConfirm(null)} style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#888", cursor: "pointer", background: "none", border: "none" }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px", color: "#FFF", backgroundColor: "#CC0000", padding: "8px 20px", border: "none", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
