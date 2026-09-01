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

  const logoSrc =
    clientLogo && clientLogo.trim() !== ""
      ? clientLogo
      : truvishLogo;

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