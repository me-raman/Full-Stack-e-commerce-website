"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: searchParams.get("gender") || "all",
    category: searchParams.get("category") || "all",
    minPrice: 0,
    maxPrice: 0,
    sort: "newest",
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);

    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (filters.gender && filters.gender !== "all") {
      query = query.eq("gender", filters.gender);
    }
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    if (filters.minPrice && filters.minPrice > 0) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters.sort === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (filters.sort === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const gender = searchParams.get("gender") || "all";
    const category = searchParams.get("category") || "all";
    setFilters((prev) => ({ ...prev, gender, category }));
  }, [searchParams]);

  const categoryLabel = filters.category && filters.category !== "all"
    ? filters.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const headingText = filters.gender === "women"
    ? "Women's Edit"
    : filters.gender === "men"
    ? "Men's Edit"
    : "All Products";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--ivory)" }}>
      {/* ─── Page Hero ─── */}
      <section
        className="flex flex-col items-center justify-center text-center"
        style={{
          backgroundColor: "var(--noir)",
          height: "220px",
          paddingTop: "72px",
        }}
      >
        <p className="section-label mb-3">Tilaak Collection</p>
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(36px, 4vw, 52px)",
            color: "var(--white)",
          }}
        >
          {headingText}
        </h1>
        <nav
          className="mt-3 flex items-center gap-2"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 300,
            fontSize: "12px",
            color: "rgba(181, 175, 166, 0.6)",
          }}
        >
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          {categoryLabel && (
            <>
              <span>/</span>
              <span style={{ color: "var(--sand)" }}>{categoryLabel}</span>
            </>
          )}
        </nav>
      </section>

      {/* ─── Filter + Products ─── */}
      <div className="flex items-start">
        {/* Desktop Sidebar */}
        <ProductFilters
          selectedGender={filters.gender}
          selectedCategory={filters.category}
          selectedSort={filters.sort}
          priceRange={[filters.minPrice, filters.maxPrice]}
          onGenderChange={(g) => setFilters((prev) => ({ ...prev, gender: g, category: "all" }))}
          onCategoryChange={(c) => setFilters((prev) => ({ ...prev, category: c }))}
          onSortChange={(s) => setFilters((prev) => ({ ...prev, sort: s }))}
          onPriceRangeChange={([min, max]) => setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))}
        />

        {/* Product Grid */}
        <div className="flex-1 px-6 lg:px-10 py-10">
          {/* Mobile filters bar */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <ProductFilters
              selectedGender={filters.gender}
              selectedCategory={filters.category}
              selectedSort={filters.sort}
              priceRange={[filters.minPrice, filters.maxPrice]}
              onGenderChange={(g) => setFilters((prev) => ({ ...prev, gender: g, category: "all" }))}
              onCategoryChange={(c) => setFilters((prev) => ({ ...prev, category: c }))}
              onSortChange={(s) => setFilters((prev) => ({ ...prev, sort: s }))}
              onPriceRangeChange={([min, max]) => setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))}
            />
            {/* Active filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {filters.gender && filters.gender !== "all" && (
                <span
                  className="shrink-0 flex items-center gap-1 px-3 py-1"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "var(--noir)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {filters.gender === "women" ? "Women" : "Men"}
                  <button onClick={() => setFilters((prev) => ({ ...prev, gender: "all", category: "all" }))}>×</button>
                </span>
              )}
              {filters.category && filters.category !== "all" && (
                <span
                  className="shrink-0 flex items-center gap-1 px-3 py-1"
                  style={{
                    fontFamily: '"Jost", sans-serif',
                    fontWeight: 500,
                    fontSize: "11px",
                    color: "var(--gold)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {categoryLabel}
                  <button onClick={() => setFilters((prev) => ({ ...prev, category: "all" }))}>×</button>
                </span>
              )}
            </div>
          </div>

          {/* Result count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 hidden lg:block"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "13px",
              color: "var(--stone)",
            }}
          >
            {isLoading
              ? "Loading products..."
              : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
          </motion.p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    style={{
                      aspectRatio: "3/4",
                      backgroundColor: "var(--ivory-deep)",
                    }}
                  />
                  <div className="mt-4 space-y-2">
                    <div style={{ height: "8px", width: "40%", backgroundColor: "var(--border)" }} />
                    <div style={{ height: "12px", width: "70%", backgroundColor: "var(--border)" }} />
                    <div style={{ height: "10px", width: "30%", backgroundColor: "var(--border)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-12">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <p
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "28px",
                  color: "var(--stone)",
                }}
              >
                No products found
              </p>
              <p
                className="mt-3 max-w-sm"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 300,
                  fontSize: "14px",
                  color: "var(--stone)",
                }}
              >
                Try adjusting your filters or browse our full collection.
              </p>
              <Link
                href="/products"
                onClick={() => {
                  setFilters({
                    gender: "all",
                    category: "all",
                    minPrice: 0,
                    maxPrice: 0,
                    sort: "newest",
                  });
                }}
                className="link-underline mt-6 inline-block"
                style={{
                  fontFamily: '"Jost", sans-serif',
                  fontWeight: 500,
                  fontSize: "12px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                Clear all filters
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: "100vh", backgroundColor: "var(--ivory)" }}>
          <div
            className="flex items-center justify-center"
            style={{
              height: "220px",
              backgroundColor: "var(--noir)",
              paddingTop: "72px",
            }}
          >
            <div className="animate-pulse" style={{ width: "200px", height: "32px", backgroundColor: "rgba(255,255,255,0.1)" }} />
          </div>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
