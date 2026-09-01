import React from "react";
import "./Wallet.css";

import { CiWallet } from "react-icons/ci";
import { FaRupeeSign } from "react-icons/fa";

const Wallet = ({
  balance,
  title,
  label,
  description,
  footer,
}) => {

  return (
    <section className="wallet-card">

      {/* Left Side */}
      <div className="wallet-left">

        <div className="wallet-icon-box">
          <CiWallet className="wallet-icon" />
        </div>

        <div className="wallet-content">

          <div className="wallet-heading">

            <span className="wallet-label">
              {label}
            </span>

            <h2 className="wallet-title">
              {title}
            </h2>

          </div>

          <p className="wallet-description">
            {description}
          </p>

        </div>

      </div>

      {/* Right Side */}
      <div className="wallet-right">

        <span className="wallet-balance-label">
          Current Balance
        </span>

        <div className="wallet-amount">

          <FaRupeeSign className="wallet-rupee" />

          <span className="wallet-value">
            {balance}
          </span>

        </div>

        <span className="wallet-footer">
          {footer}
        </span>

      </div>

    </section>
  );
};

export default Wallet;