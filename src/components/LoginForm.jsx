import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthSubmission } from "../hooks/useAuthSubmission";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFieldErrors(email, password) {
  return {
    email: !email.trim()
      ? "กรุณากรอกอีเมล"
      : !EMAIL_PATTERN.test(email.trim())
        ? "กรุณากรอกอีเมลให้ถูกต้อง"
        : "",
    password: password ? "" : "กรุณากรอกรหัสผ่าน",
  };
}

function LoginForm({ onEmailLogin, onGoogleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { clearError, error, errorRef, isPending, pendingMethod, submit } = useAuthSubmission();
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const fieldErrors = getFieldErrors(email, password);
  const showEmailError = (touched.email || hasSubmitted) && fieldErrors.email;
  const showPasswordError = (touched.password || hasSubmitted) && fieldErrors.password;

  function focusFirstInvalidField(errors) {
    if (errors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (errors.password) {
      passwordInputRef.current?.focus();
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);
    clearError();
    const errors = getFieldErrors(email, password);
    if (errors.email || errors.password) {
      focusFirstInvalidField(errors);
      return;
    }

    await submit("email", () => onEmailLogin(email.trim(), password));
  }

  async function handleGoogleClick() {
    await submit("google", onGoogleLogin);
  }

  return (
    <form className="login-form" onSubmit={handleEmailSubmit} aria-busy={isPending} noValidate>
      <button
        type="button"
        className="login-form__google"
        onClick={handleGoogleClick}
        disabled={isPending}
      >
        <FcGoogle aria-hidden="true" />
        <span>{pendingMethod === "google" ? "กำลังเชื่อมต่อกับ Google..." : "ดำเนินการต่อด้วย Google"}</span>
      </button>

      <div className="login-form__divider" aria-hidden="true">
        <span>หรือเข้าสู่ระบบด้วยอีเมล</span>
      </div>

      <div className="login-form__field">
        <label htmlFor="login-email">อีเมล</label>
        <input
          ref={emailInputRef}
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setTouched((current) => ({ ...current, email: true }))}
          disabled={isPending}
          aria-invalid={Boolean(showEmailError)}
          aria-describedby={showEmailError ? "login-email-error" : undefined}
        />
        {showEmailError && <p id="login-email-error" className="login-form__field-error">{showEmailError}</p>}
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">รหัสผ่าน</label>
        <div className="login-form__password-wrap">
          <input
            ref={passwordInputRef}
            id="login-password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="รหัสผ่านของคุณ"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            disabled={isPending}
            aria-invalid={Boolean(showPasswordError)}
            aria-describedby={showPasswordError ? "login-password-error" : undefined}
          />
          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={isPending}
            aria-label={isPasswordVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          >
            {isPasswordVisible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
        </div>
        {showPasswordError && <p id="login-password-error" className="login-form__field-error">{showPasswordError}</p>}
      </div>

      {error && (
        <p ref={errorRef} className="login-form__error" role="alert" tabIndex={-1}>
          {error}
        </p>
      )}

      <button type="submit" className="login-form__submit" disabled={isPending}>
        {pendingMethod === "email" && <span className="login-form__spinner" aria-hidden="true" />}
        {pendingMethod === "email" ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onEmailLogin: PropTypes.func.isRequired,
  onGoogleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
