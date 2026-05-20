"use client";
// app/products/page.tsx
import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

const CATEGORIES = [
  "ทั้งหมด",
  "electronics",
  "fashion",
  "home",
  "sports",
  "beauty",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cartIds, setCartIds] = useState<Set<number>>(new Set());

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const res = await fetch(`/api/products?${params}`);
    const json = await res.json();
    if (json.data) {
      setProducts(json.data.products);
      setTotal(json.data.total);
    }
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Load cart to mark items already added
  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((j) => {
        if (j.data)
          setCartIds(
            new Set(
              j.data.items.map((i: { productId: number }) => i.productId),
            ),
          );
      });
  }, []);

  async function handleAddToCart(product: Product) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });
    if (res.ok) setCartIds((s) => new Set([...s, product.id]));
  }

  return (
    <div className="container" style={{ padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            color: "var(--ink)",
          }}
        >
          สินค้าทั้งหมด
        </h1>
        {!loading && (
          <p style={{ color: "var(--ink-3)", fontSize: 14, marginTop: 4 }}>
            {total.toLocaleString()} รายการ
          </p>
        )}
      </div>

      {/* Search + Filter */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}
      >
        <div style={{ position: "relative", flex: "1 1 240px", minWidth: 200 }}>
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            data-testid="search-input"
            className="input"
            placeholder="ค้นหาสินค้า…"
            value={search}
            style={{ paddingLeft: 38 }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          data-testid="category-filter"
          className="input"
          value={category}
          style={{ flex: "0 0 auto", minWidth: 140 }}
          onChange={(e) =>
            setCategory(e.target.value === "ทั้งหมด" ? "" : e.target.value)
          }
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c === "ทั้งหมด" ? "" : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          data-testid="products-loading"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 320, borderRadius: "var(--radius-lg)" }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "var(--ink-3)",
          }}
        >
          <svg
            width="48"
            height="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            viewBox="0 0 24 24"
            style={{ margin: "0 auto 16px", opacity: 0.4 }}
          >
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          </svg>
          <p style={{ fontSize: 16 }}>ไม่พบสินค้าที่ค้นหา</p>
          <button
            className="btn btn-outline"
            style={{ marginTop: 16 }}
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            แสดงสินค้าทั้งหมด
          </button>
        </div>
      ) : (
        <div
          data-testid="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={handleAddToCart}
              isInCart={cartIds.has(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
