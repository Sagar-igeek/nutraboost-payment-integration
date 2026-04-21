import { LOGO_URL, DMCA_BADGE } from "../../utils/productData";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <div className="footer-logo-section">
          <img
            src={LOGO_URL}
            alt="NutraBoost"
            className="footer-logo"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "block";
            }}
          />
          <span className="header-logo-text">nutraboost</span>
        </div>

        <p className="mb-1">
          NutraBoost - Copyright 2026 - All Rights Reserved.
        </p>

        <div className="footer-links">
          <a
            href="https://nutraboost-us.com/policies/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Privacy Policy
          </a>
          <a
            href="https://nutraboost-us.com/policies/terms-of-service"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Terms of Service
          </a>
          <a
            href="https://nutraboost-us.com/policies/refund-policy"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            Refund Policy
          </a>
        </div>

        <div className="footer-contact-section">
          <a href="mailto:info@nutraboost-us.com">info@nutraboost-us.com</a>
        </div>

        <div className="footer-badges">
          <img
            src={DMCA_BADGE}
            alt="DMCA Protected"
            className="h-8"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </div>
    </footer>
  );
}
