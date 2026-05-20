"use client";
// app/login/page.tsx
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface FormState {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  form?: string;
}

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.email) {
    errors.email = "กรุณากรอกอีเมล";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  if (!values.password) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  } else if (values.password.length < 8) {
    errors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name as keyof Errors])
      setErrors((e) => ({ ...e, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, action: "login" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors({ form: json.error ?? "ข้อมูลไม่ถูกต้อง" });
        return;
      }
      router.push(redirect);
      router.refresh();
    } catch {
      setErrors({ form: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div className="fade-up" style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              margin: "0 auto 12px",
            }}
          >
            S
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              color: "var(--ink)",
            }}
          >
            เข้าสู่ระบบ
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
            ยินดีต้อนรับกลับมา
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "28px 28px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Form error */}
          {errors.form && (
            <div
              role="alert"
              style={{
                background: "var(--danger-bg)",
                border: "1px solid #FBBABA",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                color: "var(--danger)",
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              {errors.form}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="input-label">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                className={`input${errors.email ? " error" : ""}`}
                placeholder="your@email.com"
                data-testid="email-input"
              />
              {errors.email && (
                <p
                  data-testid="email-error"
                  className="input-error"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="input-label">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange}
                className={`input${errors.password ? " error" : ""}`}
                placeholder="••••••••"
                data-testid="password-input"
              />
              {errors.password && (
                <p
                  data-testid="password-error"
                  className="input-error"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "11px",
                fontSize: 15,
                marginTop: 4,
              }}
              data-testid="login-submit"
            >
              {loading ? (
                <>
                  <span
                    data-testid="loading-spinner"
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin .7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  กำลังเข้าสู่ระบบ…
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "var(--ink-3)",
            marginTop: 20,
          }}
        >
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            สมัครสมาชิก
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
