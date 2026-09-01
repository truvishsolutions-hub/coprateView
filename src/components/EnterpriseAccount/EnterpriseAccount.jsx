import React from "react";
import "./EnterpriseAccount.css";

import truvishLogo from "../../assets/images/TV-BG.png";
import { FiLogOut } from "react-icons/fi";

const EnterpriseAccount = ({
  clientLogo,
  clientName,
  companyType,
  subTitle,
  onLogout,
}) => {
  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "https://api.truvish.com";

  const getLogoUrl = (logo) => {
    if (!logo || typeof logo !== "string" || logo.trim() === "") {
      return truvishLogo;
    }

    const cleanLogo = logo.trim();

    // Old localhost URL
    if (
      cleanLogo.startsWith("http://localhost:8080") ||
      cleanLogo.startsWith("https://localhost:8080") ||
      cleanLogo.startsWith("http://127.0.0.1:8080") ||
      cleanLogo.startsWith("https://127.0.0.1:8080")
    ) {
      const uploadsIndex = cleanLogo.indexOf("/uploads/");

      if (uploadsIndex !== -1) {
        return `${BACKEND_URL}${cleanLogo.substring(uploadsIndex)}`;
      }

      return truvishLogo;
    }

    // Already a full URL
    if (
      cleanLogo.startsWith("https://") ||
      cleanLogo.startsWith("http://")
    ) {
      return cleanLogo;
    }

    // /uploads/image.jpg
    if (cleanLogo.startsWith("/uploads/")) {
      return `${BACKEND_URL}${cleanLogo}`;
    }

    // uploads/image.jpg
    if (cleanLogo.startsWith("uploads/")) {
      return `${BACKEND_URL}/${cleanLogo}`;
    }

    // Only filename: image.jpg
    return `${BACKEND_URL}/uploads/${cleanLogo}`;
  };

  const logoSrc = getLogoUrl(clientLogo);

  return (
    <div className="enterprise-account">

      {/* Left Side */}
      <div className="enterprise-left">

        <div className="client-logo-box">
          <img
            src={logoSrc}
            alt={clientName || "Client Logo"}
            className="client-logo"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = truvishLogo;
            }}
          />
        </div>

        <div className="enterprise-info">

          <span className="enterprise-type">
            {companyType || "Enterprise Account"}
          </span>

          <h2 className="client-name">
            {clientName || "Loading..."}
          </h2>

          <p className="enterprise-subtitle">
            {subTitle || "Corporate Rewards Dashboard"}
          </p>

        </div>

      </div>

      {/* Right Side */}
      <div className="enterprise-right">

        <img
          src={truvishLogo}
          alt="Truvish Logo"
          className="truvish-logo"
        />

        <div className="truvish-text">

          <h2>TRUVISH</h2>

          <span>
            For Enterprise Rewards
          </span>

          <button
            className="logout-btn"
            onClick={onLogout}
            type="button"
          >
            <FiLogOut className="logout-icon" />
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default EnterpriseAccount;
