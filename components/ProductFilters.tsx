"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface FilterProps {
  selectedGender: string;
  selectedCategory: string;
  selectedSort: string;
  priceRange: [number, number];
  onGenderChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPriceRangeChange: (value: [number, number]) => void;
}

const womenCategories = [
  { label: "Sarees", value: "saree" },
  { label: "Lehengas", value: "lehenga" },
  { label: "Kurta Sets", value: "kurta-set" },
  { label: "Dupattas", value: "dupatta" },
];

const menCategories = [
  { label: "Sherwanis", value: "sherwani" },
  { label: "Kurta Pyjamas", value: "kurta-pyjama" },
  { label: "Nehru Jackets", value: "nehru-jacket" },
  { label: "Indo-Western", value: "indo-western" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popular", value: "popular" },
];

export default function ProductFilters({
  selectedGender,
  selectedCategory,
  selectedSort,
  priceRange,
  onGenderChange,
  onCategoryChange,
  onSortChange,
  onPriceRangeChange,
}: FilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = selectedGender === "men"
    ? menCategories
    : selectedGender === "women"
    ? womenCategories
    : [...womenCategories, ...menCategories];

  const allCategories = [{ label: "All", value: "all" }, ...categories];

  const activeFilterCount = [
    selectedGender && selectedGender !== "all" ? selectedGender : "",
    selectedCategory && selectedCategory !== "all" ? selectedCategory : "",
    priceRange[0] > 0 || priceRange[1] > 0 ? "price" : "",
    selectedSort !== "newest" ? selectedSort : "",
  ].filter(Boolean).length;

  const clearAll = () => {
    onGenderChange("all");
    onCategoryChange("all");
    onSortChange("newest");
    onPriceRangeChange([0, 0]);
  };

  const sectionHeadingStyle = {
    fontFamily: '"Jost", sans-serif',
    fontWeight: 500 as const,
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "var(--stone)",
    marginBottom: "16px",
  };

  const filterContent = (
    <div className="space-y-8">
      {/* Gender — Two large pills */}
      <div>
        <h4 style={sectionHeadingStyle}>Gender</h4>
        <div className="flex flex-col gap-2">
          {[
            { label: "Women", value: "women" },
            { label: "Men", value: "men" },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => onGenderChange(selectedGender === g.value ? "all" : g.value)}
              className="w-full text-left px-4 py-3 transition-all"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                fontSize: "14px",
                backgroundColor: selectedGender === g.value ? "var(--noir)" : "transparent",
                color: selectedGender === g.value ? "var(--white)" : "var(--ink)",
                border: selectedGender === g.value ? "1px solid var(--noir)" : "1px solid var(--border)",
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category — Text list */}
      <div>
        <h4 style={sectionHeadingStyle}>Category</h4>
        <div className="flex flex-col">
          {allCategories.map((c) => (
            <button
              key={c.value + c.label}
              onClick={() => onCategoryChange(c.value)}
              className="text-left py-2 transition-colors"
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: selectedCategory === c.value ? 500 : 300,
                fontSize: "14px",
                color: selectedCategory === c.value ? "var(--gold)" : "var(--ink)",
                borderBottom: "1px solid rgba(var(--border-rgb, 200, 195, 188), 0.4)",
              }}
            >
              {selectedCategory === c.value && (
                <span style={{ marginRight: "6px", color: "var(--gold)" }}>·</span>
              )}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range — minimal inputs */}
      <div>
        <h4 style={sectionHeadingStyle}>Price Range</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min ₹"
            value={priceRange[0] || ""}
            onChange={(e) =>
              onPriceRangeChange([Number(e.target.value) || 0, priceRange[1]])
            }
            className="w-full bg-transparent outline-none transition-colors"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "14px",
              color: "var(--noir)",
              borderBottom: "1px solid var(--border)",
              padding: "8px 0",
              borderRadius: 0,
              border: "none",
              borderBlockEnd: "1px solid var(--border)",
            }}
          />
          <span
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "12px",
              color: "var(--stone)",
            }}
          >
            to
          </span>
          <input
            type="number"
            placeholder="Max ₹"
            value={priceRange[1] || ""}
            onChange={(e) =>
              onPriceRangeChange([priceRange[0], Number(e.target.value) || 0])
            }
            className="w-full bg-transparent outline-none transition-colors"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "14px",
              color: "var(--noir)",
              padding: "8px 0",
              borderRadius: 0,
              border: "none",
              borderBlockEnd: "1px solid var(--border)",
            }}
          />
        </div>
      </div>

      {/* Sort — Custom select */}
      <div>
        <h4 style={sectionHeadingStyle}>Sort By</h4>
        <div className="relative">
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full appearance-none cursor-pointer outline-none transition-colors bg-transparent"
            style={{
              fontFamily: '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: "14px",
              color: "var(--noir)",
              border: "1px solid var(--border)",
              padding: "10px 40px 10px 14px",
              borderRadius: 0,
            }}
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--stone)" }}
          />
        </div>
      </div>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAll}
          className="transition-colors"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 500,
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--stone)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Clear All
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block shrink-0"
        style={{ width: "240px" }}
      >
        <div
          className="sticky"
          style={{
            top: "72px",
            padding: "32px 24px",
            backgroundColor: "var(--white)",
            borderRight: "1px solid var(--border)",
            minHeight: "calc(100vh - 72px)",
          }}
        >
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 transition-colors"
          style={{
            fontFamily: '"Jost", sans-serif',
            fontWeight: 400,
            fontSize: "13px",
            color: "var(--noir)",
            border: "1px solid var(--border)",
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-5 h-5 flex items-center justify-center"
              style={{
                backgroundColor: "var(--noir)",
                color: "var(--white)",
                fontFamily: '"Jost", sans-serif',
                fontWeight: 500,
                fontSize: "10px",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 lg:hidden w-[85vw] max-w-[360px] overflow-y-auto"
              style={{ backgroundColor: "var(--ivory)" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: "22px",
                      color: "var(--noir)",
                    }}
                  >
                    Filters
                  </h3>
                  <button
                    onClick={() => setMobileOpen(false)}
                    style={{ color: "var(--stone)" }}
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>
                {filterContent}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full mt-8"
                >
                  <span>Apply Filters</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
