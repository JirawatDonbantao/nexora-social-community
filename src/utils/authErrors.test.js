import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "./authErrors";

describe("getAuthErrorMessage", () => {
  it("maps Google popup and Firebase setup errors to user-friendly Thai messages", () => {
    expect(getAuthErrorMessage({ code: "auth/popup-blocked" })).toContain("Pop-up");
    expect(getAuthErrorMessage({ code: "nexora/auth-configuration-missing" }))
      .toBe("ยังไม่ได้ตั้งค่าการเชื่อมต่อ Firebase สำหรับโปรเจกต์นี้");
    expect(getAuthErrorMessage({ code: "nexora/password-mismatch" }))
      .toBe("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
  });

  it("does not expose unknown Firebase errors to users", () => {
    expect(getAuthErrorMessage({ code: "auth/internal-error" }))
      .toBe("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  });
});
