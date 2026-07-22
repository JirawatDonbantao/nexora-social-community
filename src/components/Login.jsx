import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/useUserAuth";
import AuthPortalLayout from "./AuthPortalLayout";
import LoginForm from "./LoginForm";

function Login() {
  const { user, loading, logIn, logInWithGoogle } = useUserAuth();
  const navigate = useNavigate();

  async function handleEmailLogin(email, password) {
    await logIn(email, password);
    navigate("/", { replace: true });
  }

  async function handleGoogleLogin() {
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
    <AuthPortalLayout mode="login">
      <LoginForm
        onEmailLogin={handleEmailLogin}
        onGoogleLogin={handleGoogleLogin}
      />

      <p className="login-card__switch">
        ยังไม่มีบัญชี? <Link to="/signup">สร้างบัญชี Nexora</Link>
      </p>
    </AuthPortalLayout>
  );
}

export default Login;
