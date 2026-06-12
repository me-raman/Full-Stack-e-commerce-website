"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Download,
  Eye,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Order, ShippingAddress } from "@/types";
import { formatPrice } from "@/lib/format";

const PER_PAGE = 10;

const statusStyles: Record<string, React.CSSProperties> = {
  placed: { backgroundColor: "#F5F5F5", color: "#555", border: "1px solid #E0E0E0" },
  confirmed: { backgroundColor: "#EEF4FF", color: "#2B5CE6", border: "1px solid #C5D8FF" },
  processing: { backgroundColor: "#FFF8EE", color: "#B05C00", border: "1px solid #FFD9A0" },
  shipped: { backgroundColor: "#F0F4FF", color: "#5B2BE6", border: "1px solid #C5B5FF" },
  delivered: { backgroundColor: "#EFFAF5", color: "#1A7A4A", border: "1px solid #A8E6C5" },
  cancelled: { backgroundColor: "#FFF0F0", color: "#CC0000", border: "1px solid #FFCCCC" },
};

const paymentStyles: Record<string, React.CSSProperties> = {
  paid: { backgroundColor: "#EFFAF5", color: "#1A7A4A", border: "1px solid #A8E6C5" },
  pending: { backgroundColor: "#FFF8EE", color: "#B05C00", border: "1px solid #FFD9A0" },
  failed: { backgroundColor: "#FFF0F0", color: "#CC0000", border: "1px solid #FFCCCC" },
};

const orderStatuses = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"];

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

export default function AdminOrdersPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOrderStatus, setFilterOrderStatus] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("tilaak-admin-token");
    if (token !== "tilaak-admin-authenticated") {
      router.push("/admin");
      return;
    }
    setAuthed(true);
  }, [router]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, fetchOrders]);

  useEffect(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q)
      );
    }
    if (filterOrderStatus) result = result.filter((o) => o.order_status === filterOrderStatus);
    if (filterPaymentStatus) result = result.filter((o) => o.payment_status === filterPaymentStatus);
    if (dateFrom) result = result.filter((o) => new Date(o.created_at) >= new Date(dateFrom));
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59);
      result = result.filter((o) => new Date(o.created_at) <= to);
    }
    setFiltered(result);
    setPage(1);
  }, [orders, search, filterOrderStatus, filterPaymentStatus, dateFrom, dateTo]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_status: newStatus }),
      });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, order_status: newStatus as Order["order_status"] } : null
        );
      }
    } catch {
      console.error("Failed to update order status");
    }
  };

  const exportCSV = () => {
    const headers = ["Order #", "Customer", "Email", "Phone", "Items", "Subtotal", "Shipping", "Total", "Payment Status", "Order Status", "Date"];
    const rows = filtered.map((o) => [
      o.order_number, o.customer_name, o.customer_email, o.customer_phone,
      o.items?.length || 0, o.subtotal, o.shipping_charge, o.total,
      o.payment_status, o.order_status, new Date(o.created_at).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tilaak-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  if (!authed) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <AdminSidebar />
      <main style={{ marginLeft: "256px", padding: "32px", minHeight: "100vh" }}>
        <AdminHeader title={`Orders (${filtered.length})`} subtitle="Manage customer orders" />

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 mt-8">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#888" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order # or customer..."
              style={{ ...inputStyle, width: "100%", paddingLeft: "36px", cursor: "text" }}
            />
          </div>

          <select value={filterOrderStatus} onChange={(e) => setFilterOrderStatus(e.target.value)} className="appearance-none" style={inputStyle}>
            <option value="">All Statuses</option>
            {orderStatuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
          </select>

          <select value={filterPaymentStatus} onChange={(e) => setFilterPaymentStatus(e.target.value)} className="appearance-none" style={inputStyle}>
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />

          <button
            onClick={exportCSV}
            className="ml-auto flex items-center gap-2 transition-colors"
            style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px",
              color: "#888888", padding: "10px 16px", border: "1px solid #E5E5E5", backgroundColor: "#FFF",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", overflow: "hidden" }}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin" style={{ color: "#C09A52" }} />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888" }}>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th style={thStyle}>Order #</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Items</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Payment</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ ...tdStyle, fontWeight: 500, color: "#C09A52" }}>{order.order_number}</td>
                      <td style={tdStyle}>
                        <p style={{ fontWeight: 400, color: "#111" }}>{order.customer_name}</p>
                        <p style={{ fontSize: "11px", color: "#888" }}>{order.customer_email}</p>
                      </td>
                      <td style={{ ...tdStyle, color: "#888" }}>{order.items?.length || 0} items</td>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{formatPrice(order.total || 0)}</td>
                      <td style={tdStyle}>
                        <span className="inline-block px-3 py-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", textTransform: "capitalize", ...(paymentStyles[order.payment_status] || paymentStyles.pending) }}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={order.order_status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="appearance-none cursor-pointer outline-none"
                          style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", textTransform: "capitalize", padding: "4px 8px", border: "none", ...(statusStyles[order.order_status] || statusStyles.placed) }}
                        >
                          {orderStatuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
                        </select>
                      </td>
                      <td style={{ ...tdStyle, color: "#888" }}>{formatDate(order.created_at)}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 transition-colors"
                          style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#888" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid #E5E5E5" }}>
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888" }}>
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 disabled:opacity-30 transition-colors" style={{ border: "1px solid #E5E5E5" }}>
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 disabled:opacity-30 transition-colors" style={{ border: "1px solid #E5E5E5" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5" }}>
              <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E5E5" }}>
                <div>
                  <h2 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "18px", color: "#111" }}>Order #{selectedOrder.order_number}</h2>
                  <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "12px", color: "#888", marginTop: "2px" }}>{formatDateTime(selectedOrder.created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ color: "#888" }}><X size={18} /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block px-3 py-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", textTransform: "capitalize", ...(paymentStyles[selectedOrder.payment_status] || paymentStyles.pending) }}>
                    Payment: {selectedOrder.payment_status}
                  </span>
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="appearance-none cursor-pointer outline-none"
                    style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", textTransform: "capitalize", padding: "4px 8px", border: "none", ...(statusStyles[selectedOrder.order_status] || statusStyles.placed) }}
                  >
                    {orderStatuses.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
                  </select>
                  {selectedOrder.payment_id && (
                    <span className="px-3 py-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "#888", backgroundColor: "#F5F5F5", border: "1px solid #E0E0E0" }}>
                      Payment ID: {selectedOrder.payment_id}
                    </span>
                  )}
                </div>

                <div style={{ backgroundColor: "#F8F8F8", border: "1px solid #E5E5E5", padding: "16px" }}>
                  <h3 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>Customer Info</h3>
                  <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "14px", color: "#111" }}>{selectedOrder.customer_name}</p>
                  <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#555", marginTop: "4px" }}>
                    Email: {selectedOrder.customer_email}<br />Phone: {selectedOrder.customer_phone}
                  </p>
                </div>

                {selectedOrder.shipping_address && (
                  <div style={{ backgroundColor: "#F8F8F8", border: "1px solid #E5E5E5", padding: "16px" }}>
                    <h3 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>Shipping Address</h3>
                    <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#555" }}>
                      {(selectedOrder.shipping_address as ShippingAddress).address_line1}<br />
                      {(selectedOrder.shipping_address as ShippingAddress).address_line2 && (<>{(selectedOrder.shipping_address as ShippingAddress).address_line2}<br /></>)}
                      {(selectedOrder.shipping_address as ShippingAddress).city}, {(selectedOrder.shipping_address as ShippingAddress).state} {(selectedOrder.shipping_address as ShippingAddress).pincode}
                    </p>
                  </div>
                )}

                <div>
                  <h3 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "12px" }}>Items</h3>
                  <div className="space-y-3">
                    {(selectedOrder.items as Array<{ product_name: string; product_image?: string; size: string; color: string; quantity: number; price: number; }>)?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3" style={{ backgroundColor: "#F8F8F8", border: "1px solid #E5E5E5", padding: "12px" }}>
                        <div className="relative shrink-0 overflow-hidden" style={{ width: "48px", height: "64px", border: "1px solid #E5E5E5" }}>
                          {item.product_image ? (
                            <Image src={item.product_image} alt={item.product_name} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #F5F5F5, #E5E5E5)" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#111" }}>{item.product_name}</p>
                          <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "#888" }}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                        </div>
                        <p className="shrink-0" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px", color: "#111" }}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #E5E5E5", paddingTop: "16px" }} className="space-y-2">
                  <div className="flex justify-between"><span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888" }}>Subtotal</span><span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px", color: "#111" }}>{formatPrice(selectedOrder.subtotal || 0)}</span></div>
                  <div className="flex justify-between"><span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888" }}>Shipping</span><span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "13px", color: "#111" }}>{selectedOrder.shipping_charge === 0 ? "FREE" : `₹${selectedOrder.shipping_charge}`}</span></div>
                  <div className="flex justify-between pt-2 mt-2" style={{ borderTop: "1px solid #E5E5E5" }}>
                    <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", color: "#111" }}>Total</span>
                    <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", color: "#C09A52" }}>{formatPrice(selectedOrder.total || 0)}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${selectedOrder.customer_phone?.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${selectedOrder.customer_name}, your Tilaak order #${selectedOrder.order_number} status has been updated to: ${selectedOrder.order_status}. Thank you for shopping with us!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors"
                  style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#25D366", padding: "10px 16px", border: "1px solid #25D366" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.121 1.52 5.86L0 24l6.335-1.652A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.645-.497-5.18-1.365l-.37-.22-3.835 1.005 1.025-3.74-.24-.382A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" /></svg>
                  Send WhatsApp Update
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
