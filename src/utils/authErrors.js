const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว",
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/user-disabled": "บัญชีนี้ถูกระงับการใช้งาน",
  "auth/too-many-requests": "มีการลองเข้าสู่ระบบมากเกินไป กรุณารอสักครู่แล้วลองใหม่",
  "auth/weak-password": "รหัสผ่านไม่ปลอดภัยพอ กรุณาใช้รหัสผ่านที่ยาวขึ้น",
  "auth/network-request-failed": "ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบอินเทอร์เน็ต",
  "auth/popup-closed-by-user": "คุณปิดหน้าต่าง Google ก่อนเข้าสู่ระบบ",
  "auth/popup-blocked": "เบราว์เซอร์บล็อกหน้าต่าง Google กรุณาอนุญาต Pop-up แล้วลองใหม่",
  "auth/operation-not-allowed": "Google Sign-In ยังไม่ได้เปิดใช้งานสำหรับโปรเจกต์นี้",
  "auth/unauthorized-domain": "โดเมนนี้ยังไม่ได้รับอนุญาตให้ใช้ Google Sign-In",
  "auth/account-exists-with-different-credential": "อีเมลนี้มีบัญชีอยู่แล้วด้วยวิธีเข้าสู่ระบบอื่น",
  "nexora/password-mismatch": "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
  "nexora/auth-configuration-missing": "ยังไม่ได้ตั้งค่าการเชื่อมต่อ Firebase สำหรับโปรเจกต์นี้",
};

export function getAuthErrorMessage(error) {
  return AUTH_ERROR_MESSAGES[error?.code] || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}
