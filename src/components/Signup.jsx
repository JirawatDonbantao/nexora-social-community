import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/useUserAuth";
import AuthPortalLayout from "./AuthPortalLayout";
import SignupForm from "./SignupForm";

function Signup() {
  const { user, loading, signUp, logInWithGoogle } = useUserAuth();
  const navigate = useNavigate();

  async function handleSignup(email, password) {
    await signUp(email, password);
    navigate("/", { replace: true });
  }

  async function handleGoogleSignup() {
    await logInWithGoogle();
    navigate("/", { replace: true });
  }

  if (loading) {
    return (
      <main className="login-page login-page--loading">
        <p role="status">กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthPortalLayout mode="signup">
      <SignupForm
        onEmailSignup={handleSignup}
        onGoogleSignup={handleGoogleSignup}
      />

      <p className="login-card__switch">
        มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
      </p>
    </AuthPortalLayout>
  );
}

export default Signup;
