import { test, expect } from "@playwright/test";

const REGISTER_EMAIL = `e2e-${Date.now()}@example.com`;
const LOGIN_EMAIL = "login-e2e@example.com";
const VALID_PASSWORD = "Password1";

test.describe("Register", () => {
  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("name-error")).toContainText("กรุณากรอกชื่อ");
    await expect(page.getByTestId("email-error")).toContainText("กรุณากรอกอีเมล");
    await expect(page.getByTestId("password-error")).toContainText("กรุณากรอกรหัสผ่าน");
    await expect(page.getByTestId("confirm-password-error")).toContainText("กรุณายืนยันรหัสผ่าน");
  });

  test("shows error for invalid email format", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("email-input").fill("notanemail");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("email-error")).toContainText("รูปแบบอีเมลไม่ถูกต้อง");
  });

  test("shows error for password without uppercase", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("password-input").fill("alllower1");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("password-error")).toContainText("ต้องมีตัวพิมพ์ใหญ่");
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("name-input").fill("Test User");
    await page.getByTestId("email-input").fill(REGISTER_EMAIL);
    await page.getByTestId("password-input").fill(VALID_PASSWORD);
    await page.getByTestId("confirm-password-input").fill("Different1");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("confirm-password-error")).toContainText("รหัสผ่านไม่ตรงกัน");
  });

  test("registers successfully and redirects to home", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("name-input").fill("Test User");
    await page.getByTestId("email-input").fill(REGISTER_EMAIL);
    await page.getByTestId("password-input").fill(VALID_PASSWORD);
    await page.getByTestId("confirm-password-input").fill(VALID_PASSWORD);
    await page.getByTestId("register-submit").click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("Login", () => {
  test.beforeAll(async ({ request }) => {
    // Pre-create the test user (ignore failure if already exists)
    await request.post("/api/auth", {
      data: {
        name: "Login E2E User",
        email: LOGIN_EMAIL,
        password: VALID_PASSWORD,
        action: "register",
      },
    });
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("email-error")).toContainText("กรุณากรอกอีเมล");
    await expect(page.getByTestId("password-error")).toContainText("กรุณากรอกรหัสผ่าน");
  });

  test("shows error for invalid email format", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill("notanemail");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("email-error")).toContainText("รูปแบบอีเมลไม่ถูกต้อง");
  });

  test("shows error for password shorter than 8 characters", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill(LOGIN_EMAIL);
    await page.getByTestId("password-input").fill("short");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("password-error")).toContainText("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
  });

  test("shows error for wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill(LOGIN_EMAIL);
    await page.getByTestId("password-input").fill("WrongPass1");
    await page.getByTestId("login-submit").click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("logs in successfully and redirects to home", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill(LOGIN_EMAIL);
    await page.getByTestId("password-input").fill(VALID_PASSWORD);
    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL("/");
  });
});
