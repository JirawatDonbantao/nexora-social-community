import PropTypes from "prop-types";
import communityConstellation from "../assets/nexora/community-constellation.svg";
import { BRAND_LOGO_HORIZONTAL, BRAND_NAME, BRAND_TAGLINE } from "../brand";
import "../styles/login.css";

const PORTAL_COPY = {
  login: {
    brandDescription: "เชื่อมต่อกับเพื่อน แบ่งปันช่วงเวลาสำคัญ และค้นพบชุมชนที่เป็นตัวคุณ",
    brandTitle: <>พื้นที่ของคุณ<br />เรื่องราวของคุณ<br />ชุมชนของเรา</>,
    cardDescription: "เข้าสู่ระบบเพื่อเชื่อมต่อกับคอมมูนิตี้ของคุณอีกครั้ง",
    cardKicker: "WELCOME BACK",
    cardTitle: "ยินดีต้อนรับกลับสู่ Nexora",
  },
  signup: {
    brandDescription: "เริ่มต้นแบ่งปันไอเดีย สร้างความสัมพันธ์ และเติบโตไปกับชุมชนที่เป็นตัวคุณ",
    brandTitle: <>ทุกจุดเริ่มต้น<br />พาคุณไปพบ<br />ชุมชนของคุณ</>,
    cardDescription: "สร้างบัญชีเพื่อเริ่มเชื่อมต่อกับคอมมูนิตี้ Nexora",
    cardKicker: "JOIN NEXORA",
    cardTitle: "เริ่มต้นกับ Nexora",
  },
};

function AuthPortalLayout({ children, mode }) {
  const copy = PORTAL_COPY[mode];
  const titleId = `${mode}-portal-title`;

  return (
    <main className={`login-page login-page--${mode}`}>
      <div className="login-page__glow login-page__glow--primary" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--accent" aria-hidden="true" />

      <div className="login-page__shell">
        <section className="login-brand" aria-labelledby={`${mode}-brand-title`}>
          <img className="login-brand__logo" src={BRAND_LOGO_HORIZONTAL} alt={BRAND_NAME} />
          <p className="login-brand__eyebrow">NEXORA COMMUNITY</p>
          <h1 id={`${mode}-brand-title`}>{copy.brandTitle}</h1>
          <p className="login-brand__description">{copy.brandDescription}</p>
          <p className="login-brand__tagline">{BRAND_TAGLINE}</p>

          <img
            className="login-brand__illustration"
            src={communityConstellation}
            alt=""
            aria-hidden="true"
          />
        </section>

        <section className="login-card" aria-labelledby={titleId}>
          <p className="login-card__kicker">{copy.cardKicker}</p>
          <h2 id={titleId}>{copy.cardTitle}</h2>
          <p className="login-card__description">{copy.cardDescription}</p>
          {children}
        </section>
      </div>
    </main>
  );
}

AuthPortalLayout.propTypes = {
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(["login", "signup"]).isRequired,
};

export default AuthPortalLayout;
