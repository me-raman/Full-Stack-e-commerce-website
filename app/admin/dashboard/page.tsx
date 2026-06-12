"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";
import { Order, Product } from "@/types";

const statusStyles: Record<string, React.CSSProperties> = {
  placed: { backgroundColor: "#F5F5F5", color: "#555", border: "1px solid #E0E0E0" },
  confirmed: { backgroundColor: "#EEF4FF", color: "#2B5CE6", border: "1px solid #C5D8FF" },
  processing: { backgroundColor: "#FFF8EE", color: "#B05C00", border: "1px solid #FFD9A0" },
  shipped: { backgroundColor: "#F0F4FF", color: "#5B2BE6", border: "1px solid #C5B5FF" },
  delivered: { backgroundColor: "#EFFAF5", color: "#1A7A4A", border: "1px solid #A8E6C5" },
  cancelled: { backgroundColor: "#FFF0F0", color: "#CC0000", border: "1px solid #FFCCCC" },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tilaak-admin-token");
    if (token !== "tilaak-admin-authenticated") {
      router.push("/admin");
      return;
    }
    setAuthed(true);

    async function fetchData() {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (orders) setRecentOrders(orders as Order[]);

      const { data: products } = await supabase
        .from("products")
        .select("*")
        .lt("stock", 5)
        .eq("is_active", true)
        .order("stock", { ascending: true });

      if (products) setLowStockProducts(products as Product[]);
      setLoading(false);
    }

    fetchData();
  }, [router]);

  if (!authed) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F8F8" }}>
      <AdminSidebar />
      <main style={{ marginLeft: "256px", padding: "32px", minHeight: "100vh" }}>
        <AdminHeader title="Dashboard" subtitle="Welcome back, Admin" />
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", color: "#111111" }}>
                Recent Orders
              </h3>
              <Link
                href="/admin/dashboard/orders"
                className="flex items-center gap-1 transition-colors"
                style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#888888" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#111111")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin" style={{ color: "#C09A52" }} />
              </div>
            ) : recentOrders.length === 0 ? (
              <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "13px", color: "#888888", textAlign: "center", padding: "32px 0" }}>
                No orders yet
              </p>
            ) : (
              <div className="overflow-x-auto" style={{ border: "1px solid #E5E5E5" }}>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th style={thStyle}>Order #</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td style={{ ...tdStyle, fontWeight: 500, color: "#C09A52" }}>{order.order_number}</td>
                        <td style={{ ...tdStyle, fontWeight: 400 }}>{order.customer_name}</td>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{formatPrice(order.total || 0)}</td>
                        <td style={tdStyle}>
                          <span
                            className="inline-block px-3 py-1"
                            style={{
                              fontFamily: '"Jost", sans-serif',
                              fontWeight: 500,
                              fontSize: "11px",
                              textTransform: "capitalize",
                              ...(statusStyles[order.order_status] || statusStyles.placed),
                            }}
                          >
                            {order.order_status}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: "#888888" }}>{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          <div style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E5E5", padding: "24px" }}>
            <h3 style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: "15px", color: "#111111", marginBottom: "20px" }}>
              Low Stock Alert
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin" style={{ color: "#C09A52" }} />
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={32} className="mx-auto mb-3" style={{ color: "#1A7A4A" }} />
                <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#1A7A4A" }}>
                  All products well stocked
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-4"
                    style={{ borderBottom: "1px solid #F0F0F0" }}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={16} style={{ color: "#B05C00" }} />
                      <div>
                        <p className="line-clamp-1" style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#111111" }}>
                          {product.name}
                        </p>
                        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "11px", color: "#888888" }}>
                          Stock: <span style={{ color: "#CC0000", fontWeight: 500 }}>{product.stock}</span>
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/admin/dashboard/products"
                      style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: "13px", color: "#888888" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#111111")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#888888")}
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
