"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  LogOut,
} from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/products", label: "Products", icon: Package },
  { href: "/admin/dashboard/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("tilaak-admin-token");
    router.push("/admin");
  };

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
      style={{ width: "256px", backgroundColor: "#111111" }}
    >
      {/* Logo */}
      <div className="pl-6 pt-8 pb-2">
        <Link href="/admin/dashboard">
          <span
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 200,
              fontSize: "18px",
              letterSpacing: "0.3em",
              color: "#FFFFFF",
            }}
          >
            TILAAK
          </span>
        </Link>
        <p
          className="mt-1"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 300,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#C09A52",
          }}
        >
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8 px-3 space-y-0.5">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 transition-all"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                fontSize: "13px",
                padding: "14px 24px",
                color: isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
                backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                borderLeft: isActive ? "2px solid #C09A52" : "2px solid transparent",
              }}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px" }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 transition-colors"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400,
            fontSize: "13px",
            padding: "12px 12px",
            color: "rgba(255,255,255,0.4)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <ExternalLink size={16} />
          View Store
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 transition-colors"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400,
            fontSize: "13px",
            padding: "12px 12px",
            color: "rgba(255,255,255,0.4)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
