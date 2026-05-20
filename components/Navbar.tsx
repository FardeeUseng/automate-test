"use client";
// components/Navbar.tsx
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { User } from "@/types";

interface Props {
  user?: User | null;
  cartCount?: number;
}

export default function Navbar({ user, cartCount = 0 }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navLinks = [{ href: "/products", label: "สินค้า" }];

  return (
    <header
      data-testid="navbar"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(247,245,240,.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{ display: "flex", alignItems: "center", height: 60, gap: 24 }}
      >
        {/* Logo */}
        <Link
          href="/"
          data-testid="navbar-logo"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            S
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 17,
              color: "var(--ink)",
            }}
          >
            ShopQA
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                fontSize: 14,
                fontWeight: pathname === link.href ? 500 : 400,
                color:
                  pathname === link.href ? "var(--accent)" : "var(--ink-2)",
                background:
                  pathname === link.href ? "var(--accent-bg)" : "transparent",
                transition: "all var(--duration) var(--ease)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Cart */}
          <Link
            href="/cart"
            data-testid="cart-link"
            aria-label="ตะกร้าสินค้า"
            style={{
              position: "relative",
              padding: 8,
              borderRadius: "var(--radius-md)",
              color: "var(--ink-2)",
              transition: "background var(--duration)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--bg-subtle)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span
                data-testid="cart-badge"
                className="badge"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  fontSize: 10,
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>
                {user.name}
              </span>
              <button
                data-testid="logout-btn"
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: "6px 12px", fontSize: 13 }}
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary"
              style={{ padding: "6px 16px", fontSize: 13 }}
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
