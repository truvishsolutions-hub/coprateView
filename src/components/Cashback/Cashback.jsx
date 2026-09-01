import React from "react";
import "./Cashback.css";

import { FaRupeeSign } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

const Cashback = ({
  cashback,
  thisMonth,
  label,
  title,
  description,
  footer,
}) => {
  return (
    <section className="cashback-card">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="cashback-left">

        <div className="cashback-icon-box">
          <RiMoneyRupeeCircleLine className="cashback-icon" />
        </div>

        <div className="cashback-content">

          <span className="cashback-label">
            {label}
          </span>

          <h2 className="cashback-title">
            {title}
          </h2>

          <p className="cashback-description">
            {description}
          </p>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="cashback-right">

        <span className="cashback-earned-label">
          {footer}
        </span>

        <div className="cashback-amount">

          <FaRupeeSign className="cashback-rupee" />

          <span className="cashback-value">
            {cashback}
          </span>

        </div>

        <span className="cashback-footer">
          +₹{thisMonth} this month
        </span>

      </div>

    </section>
  );
};

export default Cashback;