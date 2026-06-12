"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";

interface StatCard {
  label: string;
  value: string;
  trend: string;
  icon: React.ElementType;
}

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: orderCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        const { data: revenueData } = await supabase
          .from("orders")
          .select("total")
          .eq("payment_status", "paid");

        const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

        const { count: pendingCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .in("order_status", ["placed", "confirmed"]);

        const { count: productCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        setStats({
          totalOrders: orderCount || 0,
          totalRevenue,
          pendingOrders: pendingCount || 0,
          totalProducts: productCount || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards: StatCard[] = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      trend: "+12% this month",
      icon: ShoppingBag,
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      trend: "+8% this month",
      icon: () => (
        <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: "18px", color: "#C09A52" }}>₹</span>
      ),
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      trend: "Needs attention",
      icon: Clock,
    },
    {
      label: "Total Products",
      value: stats.totalProducts.toString(),
      trend: "Active catalog",
      icon: Package,
    },
  ];

  const getTrendStyle = (trend: string) => {
    if (trend.startsWith("+")) return { backgroundColor: "#EFFAF5", color: "#1A7A4A", border: "1px solid #A8E6C5" };
    if (trend.includes("attention")) return { backgroundColor: "#FFF0F0", color: "#CC0000", border: "1px solid #FFCCCC" };
    return { backgroundColor: "#F5F5F5", color: "#555555", border: "1px solid #E0E0E0" };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-8">
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E5E5",
            padding: "28px",
          }}
        >
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div style={{ width: "20px", height: "20px", backgroundColor: "#E5E5E5" }} />
              <div style={{ height: "32px", width: "50%", backgroundColor: "#E5E5E5" }} />
              <div style={{ height: "12px", width: "70%", backgroundColor: "#E5E5E5" }} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <card.icon size={20} style={{ color: "#C09A52" }} />
                <span
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#888888",
                  }}
                >
                  {card.label}
                </span>
              </div>
              <p
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "36px",
                  color: "#111111",
                  lineHeight: 1.2,
                }}
              >
                {card.value}
              </p>
              <div className="mt-2">
                <span
                  className="inline-block px-2 py-0.5"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "11px",
                    ...getTrendStyle(card.trend),
                  }}
                >
                  {card.trend}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
