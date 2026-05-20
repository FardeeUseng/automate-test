"use client";
// app/register/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

function validate(v: FormState): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "กรุณากรอกชื่อ";
  else if (v.name.trim().length < 2) e.name = "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร";

  if (!v.email) e.email = "กรุณากรอกอีเมล";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = "รูปแบบอีเมลไม่ถูกต้อง";

  if (!v.password) e.password = "กรุณากรอกรหัสผ่าน";
  else if (v.password.length < 8)
    e.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v.password))
    e.password = "ต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลขอย่างละ 1 ตัว";

  if (!v.confirmPassword) e.confirmPassword = "กรุณายืนยันรหัสผ่าน";
  else if (v.password !== v.confirmPassword)
    e.confirmPassword = "รหัสผ่านไม่ตรงกัน";

  return e;
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { label: "อย่างน้อย 8 ตัวอักษร", ok: password.length >= 8 },
    { label: "ตัวพิมพ์ใหญ่ (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "ตัวพิมพ์เล็ก (a-z)", ok: /[a-z]/.test(password) },
    { label: "ตัวเลข (0-9)", ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#E24B4A", "#E24B4A", "#BA7517", "#639922", "#2E7D32"];
  const labels = ["", "อ่อน", "อ่อน", "ปานกลาง", "แข็งแกร่ง"];

  return (
    <div style={{ marginTop: 8 }}>
      {/* Bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i <= score ? colors[score] : "var(--border)",
              transition: "background .3s",
            }}
          />
        ))}
        {score > 0 && (
          <span
            style={{
              fontSize: 11,
              color: colors[score],
              fontWeight: 500,
              marginLeft: 6,
              whiteSpace: "nowrap",
            }}
          >
            {labels[score]}
          </span>
        )}
      </div>
      {/* Checklist */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2px 8px",
        }}
      >
        {checks.map((c) => (
          <div
            key={c.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
            }}
          >
            <span
              style={{
                color: c.ok ? "var(--success)" : "var(--ink-3)",
                fontSize: 13,
                lineHeight: 1,
              }}
            >
              {c.ok ? "✓" : "○"}
            </span>
            <span style={{ color: c.ok ? "var(--ink-2)" : "var(--ink-3)" }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email,
          password: values.password,
          action: "register",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors({
          form: json.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        });
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErrors({ form: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setLoading(false);
    }
  }

  const fields: {
    name: keyof FormState;
    label: string;
    type: string;
    placeholder: string;
    toggle?: boolean;
    showState?: boolean;
    onToggle?: () => void;
    testId: string;
    errorTestId: string;
    autoComplete: string;
  }[] = [
    {
      name: "name",
      label: "ชื่อ-นามสกุล",
      type: "text",
      placeholder: "สมชาย ใจดี",
      testId: "name-input",
      errorTestId: "name-error",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "อีเมล",
      type: "email",
      placeholder: "your@email.com",
      testId: "email-input",
      errorTestId: "email-error",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "รหัสผ่าน",
      type: showPassword ? "text" : "password",
      placeholder: "••••••••",
      toggle: true,
      showState: showPassword,
      onToggle: () => setShowPassword((s) => !s),
      testId: "password-input",
      errorTestId: "password-error",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "ยืนยันรหัสผ่าน",
      type: showConfirm ? "text" : "password",
      placeholder: "••••••••",
      toggle: true,
      showState: showConfirm,
      onToggle: () => setShowConfirm((s) => !s),
      testId: "confirm-password-input",
      errorTestId: "confirm-password-error",
      autoComplete: "new-password",
    },
  ];

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
      <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>
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
            สมัครสมาชิก
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>
            สร้างบัญชีใหม่เพื่อเริ่มต้นช้อปปิ้ง
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
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="input-label">
                  {f.label}
                </label>

                <div style={{ position: "relative" }}>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    value={values[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    autoComplete={f.autoComplete}
                    className={`input${errors[f.name] ? " error" : ""}`}
                    style={f.toggle ? { paddingRight: 40 } : undefined}
                    data-testid={f.testId}
                  />
                  {f.toggle && (
                    <button
                      type="button"
                      onClick={f.onToggle}
                      aria-label={f.showState ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ink-3)",
                        padding: 4,
                        lineHeight: 1,
                      }}
                    >
                      {f.showState ? (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {/* Password strength meter */}
                {f.name === "password" && (
                  <PasswordStrength password={values.password} />
                )}

                {errors[f.name] && (
                  <p
                    data-testid={f.errorTestId}
                    className="input-error"
                    role="alert"
                  >
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            {/* Terms */}
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-3)",
                lineHeight: 1.6,
                marginTop: 2,
              }}
            >
              การสมัครสมาชิกถือว่าคุณยอมรับ{" "}
              <Link href="/terms" style={{ color: "var(--accent)" }}>
                ข้อกำหนดการใช้งาน
              </Link>{" "}
              และ{" "}
              <Link href="/privacy" style={{ color: "var(--accent)" }}>
                นโยบายความเป็นส่วนตัว
              </Link>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "11px",
                fontSize: 15,
                marginTop: 2,
              }}
              data-testid="register-submit"
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
                  กำลังสมัครสมาชิก…
                </>
              ) : (
                "สมัครสมาชิก"
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
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/login"
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
