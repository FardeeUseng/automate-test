"use client";
// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isInCart?: boolean;
}

function formatPrice(price: number) {
  return "฿" + price.toLocaleString("th-TH");
}

export default function ProductCard({ product, onAddToCart, isInCart }: Props) {
  const outOfStock = product.stock === 0;

  return (
    <div
      data-testid="product-card"
      className="fade-up"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition:
          "box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        style={{ position: "relative", display: "block" }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            background: "var(--bg-subtle)",
            overflow: "hidden",
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{
              objectFit: "cover",
              transition: "transform .3s var(--ease)",
            }}
            data-testid="product-image"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {outOfStock && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(247,245,240,.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  background: "var(--ink)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                หมดสต็อก
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--ink-3)",
              textTransform: "uppercase",
              letterSpacing: ".05em",
            }}
          >
            {product.category}
          </span>
          <Link href={`/products/${product.id}`}>
            <h3
              data-testid="product-name"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                marginTop: 2,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <span
            data-testid="product-price"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--accent)",
            }}
          >
            {formatPrice(product.price)}
          </span>

          {product.stock > 0 && product.stock <= 5 && (
            <span
              style={{ fontSize: 11, color: "var(--warning)", fontWeight: 500 }}
            >
              เหลือ {product.stock} ชิ้น
            </span>
          )}
        </div>

        <button
          data-testid="add-to-cart-btn"
          onClick={() => onAddToCart?.(product)}
          disabled={outOfStock}
          className={`btn ${isInCart ? "btn-outline" : "btn-primary"}`}
          style={{ width: "100%", fontSize: 14 }}
        >
          {outOfStock
            ? "หมดสต็อก"
            : isInCart
              ? "✓ อยู่ในตะกร้าแล้ว"
              : "เพิ่มลงตะกร้า"}
        </button>
      </div>
    </div>
  );
}
