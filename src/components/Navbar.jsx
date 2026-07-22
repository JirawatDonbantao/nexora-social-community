import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaUserFriends,
  FaUsers,
  FaVideo,
  FaGamepad,
  FaComments,
  FaBell
} from "react-icons/fa";
import {
  BRAND_APP_ICON,
  BRAND_LOGO_HORIZONTAL,
  BRAND_NAME,
} from "../brand";
import { PROFILE_IMAGE, PROFILE_NAME } from "../constants";
import { useUserAuth } from "../context/useUserAuth";


function Navbar({ searchQuery, onSearchChange }) {
  const { user, loading, logOut } = useUserAuth();
  const [logoutError, setLogoutError] = useState("");
  const navigate = useNavigate();

  async function handleLogout() {
    setLogoutError("");

    try {
      await logOut();
      navigate("/", { replace: true });
    } catch {
      setLogoutError("ออกจากระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <div className="Navbar">
      
      {/* ส่วนซ้าย: โลโก้ และ ช่องค้นหา */}
      <div className="navbar__left">
        <Link className="brand-logo-link" to="/" aria-label={`${BRAND_NAME} หน้าหลัก`}>
          <img className="brand-logo-wordmark" src={BRAND_LOGO_HORIZONTAL} alt={BRAND_NAME} />
          <img className="brand-logo-mark" src={BRAND_APP_ICON} alt="" aria-hidden="true" />
        </Link>
        <div className="search-box">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label={`ค้นหาบน ${BRAND_NAME}`}
            placeholder={`ค้นหาบน ${BRAND_NAME}`}
          />
        </div>
      </div>

      {/* ส่วนกลาง: ไอคอนเมนูหลัก */}
      <div className="navbar__center">
        {/* ใส่ class active ให้ปุ่มหน้าหลักเป็นสีน้ำเงิน */}
        <Link className="nav-icon active" to="/" aria-label="หน้าหลัก"><FaHome /></Link>
        <button type="button" className="nav-icon nav-icon--demo" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="เพื่อน — ฟีเจอร์เดโม"><FaUserFriends /></button>
        <button type="button" className="nav-icon nav-icon--demo" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="วิดีโอ — ฟีเจอร์เดโม"><FaVideo /></button>
        <button type="button" className="nav-icon nav-icon--demo" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="กลุ่ม — ฟีเจอร์เดโม"><FaUsers /></button>
        <button type="button" className="nav-icon nav-icon--demo" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="เกม — ฟีเจอร์เดโม"><FaGamepad /></button>
      </div>

      {/* ส่วนขวา: เข้าสู่ระบบ หรือ เมนูผู้ใช้ */}
      <div className="navbar__right">
        {loading ? (
          <span
            className="auth-nav__loading"
            role="status"
            aria-label="กำลังตรวจสอบสถานะการเข้าสู่ระบบ"
          />
        ) : user ? (
          <>
            <button type="button" className="icon-btn icon-btn--demo" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="ข้อความ — ฟีเจอร์เดโม"><FaComments /></button>
            <button type="button" className="icon-btn icon-btn--demo" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="การแจ้งเตือน — ฟีเจอร์เดโม"><FaBell /></button>

            <div className="profile-btn">
              <img src={PROFILE_IMAGE} alt="profile" />
              <span>{PROFILE_NAME.split(" ")[0]}</span>
            </div>

            <button type="button" className="auth-nav__logout" onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </>
        ) : (
          <div className="auth-nav__actions">
            <Link className="auth-nav__login" to="/login">Login</Link>
            <Link className="auth-nav__signup" to="/signup">Sign Up</Link>
          </div>
        )}

        {logoutError && <p className="auth-nav__error" role="alert">{logoutError}</p>}
      </div>

    </div>
  );
}

Navbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default Navbar;
