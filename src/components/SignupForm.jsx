import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuthSubmission } from "../hooks/useAuthSubmission";
import { getAuthErrorMessage } from "../utils/authErrors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function getFieldErrors(email, password, passwordConfirmation) {
  return {
    email: !email.trim()
      ? "กรุณากรอกอีเมล"
      : !EMAIL_PATTERN.test(email.trim())
        ? "กรุณากรอกอีเมลให้ถูกต้อง"
        : "",
    password: !password
      ? "กรุณากรอกรหัสผ่าน"
      : password.length < MIN_PASSWORD_LENGTH
        ? `รหัสผ่านต้องมีอย่างน้อย ${MIN_PASSWORD_LENGTH} ตัวอักษร`
        : "",
    passwordConfirmation: !passwordConfirmation
      ? "กรุณายืนยันรหัสผ่าน"
      : password !== passwordConfirmation
        ? getAuthErrorMessage({ code: "nexora/password-mismatch" })
        : "",
  };
}

function SignupForm({ onEmailSignup, onGoogleSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false, passwordConfirmation: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { clearError, error, errorRef, isPending, pendingMethod, submit } = useAuthSubmission();
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmationInputRef = useRef(null);

  const fieldErrors = getFieldErrors(email, password, passwordConfirmation);
  const showEmailError = (touched.email || hasSubmitted) && fieldErrors.email;
  const showPasswordError = (touched.password || hasSubmitted) && fieldErrors.password;
  const showPasswordConfirmationError = (touched.passwordConfirmation || hasSubmitted) && fieldErrors.passwordConfirmation;
  const passwordToggleLabel = isPasswordVisible ? "ซ่อนรหัสผ่านทั้งหมด" : "แสดงรหัสผ่านทั้งหมด";

  function focusFirstInvalidField(errors) {
    if (errors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (errors.password) {
      passwordInputRef.current?.focus();
      return;
    }
    if (errors.passwordConfirmation) {
      passwordConfirmationInputRef.current?.focus();
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);
    clearError();

    const errors = getFieldErrors(email, password, passwordConfirmation);
    if (errors.email || errors.password || errors.passwordConfirmation) {
      focusFirstInvalidField(errors);
      return;
    }

    await submit("email", () => onEmailSignup(email.trim(), password));
  }

  async function handleGoogleClick() {
    await submit("google", onGoogleSignup);
  }

  return (
    <form className="login-form signup-form" onSubmit={handleEmailSubmit} aria-busy={isPending} noValidate>
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
        <span>หรือสมัครด้วยอีเมล</span>
      </div>

      <div className="login-form__field">
        <label htmlFor="signup-email">อีเมล</label>
        <input
          ref={emailInputRef}
          id="signup-email"
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
          aria-describedby={showEmailError ? "signup-email-error" : undefined}
        />
        {showEmailError && <p id="signup-email-error" className="login-form__field-error">{showEmailError}</p>}
      </div>

      <div className="login-form__field">
        <label htmlFor="signup-password">รหัสผ่าน</label>
        <div className="login-form__password-wrap">
          <input
            ref={passwordInputRef}
            id="signup-password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="ตั้งรหัสผ่านของคุณ"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, password: true }))}
            disabled={isPending}
            aria-invalid={Boolean(showPasswordError)}
            aria-describedby={["signup-password-hint", showPasswordError && "signup-password-error"].filter(Boolean).join(" ")}
          />
          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={isPending}
            aria-label={passwordToggleLabel}
          >
            {isPasswordVisible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
        </div>
        <p id="signup-password-hint" className="signup-form__hint">อย่างน้อย {MIN_PASSWORD_LENGTH} ตัวอักษร</p>
        {showPasswordError && <p id="signup-password-error" className="login-form__field-error">{showPasswordError}</p>}
      </div>

      <div className="login-form__field">
        <label htmlFor="signup-password-confirmation">ยืนยันรหัสผ่าน</label>
        <div className="login-form__password-wrap signup-form__password-confirmation-wrap">
          <input
            ref={passwordConfirmationInputRef}
            id="signup-password-confirmation"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            onBlur={() => setTouched((current) => ({ ...current, passwordConfirmation: true }))}
            disabled={isPending}
            aria-invalid={Boolean(showPasswordConfirmationError)}
            aria-describedby={showPasswordConfirmationError ? "signup-password-confirmation-error" : undefined}
          />
        </div>
        {showPasswordConfirmationError && <p id="signup-password-confirmation-error" className="login-form__field-error">{showPasswordConfirmationError}</p>}
      </div>

      {error && (
        <p ref={errorRef} className="login-form__error" role="alert" tabIndex={-1}>
          {error}
        </p>
      )}

      <button type="submit" className="login-form__submit" disabled={isPending}>
        {pendingMethod === "email" && <span className="login-form__spinner" aria-hidden="true" />}
        {pendingMethod === "email" ? "กำลังสร้างบัญชี..." : "สร้างบัญชี Nexora"}
      </button>
    </form>
  );
}

SignupForm.propTypes = {
  onEmailSignup: PropTypes.func.isRequired,
  onGoogleSignup: PropTypes.func.isRequired,
};

export default SignupForm;
