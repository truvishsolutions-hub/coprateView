import "./RedeemedCodes.css";

import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FaRupeeSign } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const RedeemedCodes = ({
  value,
  totalCodes,
  redemptionRate,
  totalUsers,
  isFlipped = false,
}) => {
  return (
    <div className={`redeemed-flip-wrapper ${isFlipped ? "is-flipped" : ""}`}>
      <div className="redeemed-flip-inner">

        {/* =====================================================
            FRONT - REDEEMED CODES
        ===================================================== */}

        <div className="redeemed-card redeemed-front">

          <div className="redeemed-header">

            <div className="redeemed-icon">
              <MdVerified />
            </div>

            <div className="redeemed-arrow">
              <HiOutlineArrowUpRight />
            </div>

          </div>

          <h2 className="redeemed-title">
            Redeemed Codes
          </h2>

          <div className="redeemed-section">

            <span className="redeemed-label">
              Value
            </span>

            <h1 className="redeemed-value">
              <FaRupeeSign />

              <span>
                {value ?? 0}
              </span>
            </h1>

          </div>

          <div className="redeemed-divider"></div>

          <div className="redeemed-section">

            <span className="redeemed-label">
              Count
            </span>

            <h3 className="redeemed-count">
              {totalCodes ?? 0} Codes
            </h3>

          </div>

          <div className="redeemed-bottom">

            <div className="redeemed-stat">

              <span className="redeemed-small-title">
                Redemption %
              </span>

              <h4 className="redeemed-stat-value">
                {redemptionRate ?? 0}%
              </h4>

              <p className="redeemed-small-text">
                of issued codes
              </p>

            </div>

            <div className="redeemed-stat">

              <span className="redeemed-small-title">
                Total Users
              </span>

              <h4 className="redeemed-stat-value">
                {totalUsers ?? 0}
              </h4>

              <p className="redeemed-small-text">
                reward recipients
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            BACK - REDEEMED
        ===================================================== */}

        <div className="redeemed-card redeemed-back">

          <div className="redeemed-header">

            <div className="redeemed-icon">
              <MdVerified />
            </div>

            <div className="redeemed-arrow">
              <HiOutlineArrowUpRight />
            </div>

          </div>

          <h2 className="redeemed-title">
            Redeemed
          </h2>

          <div className="redeemed-section">

            <span className="redeemed-label">
              Value
            </span>

            <h1 className="redeemed-value">
              <FaRupeeSign />

              <span>
                {value ?? 0}
              </span>
            </h1>

          </div>

          <div className="redeemed-divider"></div>

          <div className="redeemed-section">

            <span className="redeemed-label">
              Count
            </span>

            <h3 className="redeemed-count">
              {totalCodes ?? 0} Codes
            </h3>

          </div>

          <div className="redeemed-bottom">

            <div className="redeemed-stat">

              <span className="redeemed-small-title">
                Redemption %
              </span>

              <h4 className="redeemed-stat-value">
                {redemptionRate ?? 0}%
              </h4>

              <p className="redeemed-small-text">
                of issued codes
              </p>

            </div>

            <div className="redeemed-stat">

              <span className="redeemed-small-title">
                Total Users
              </span>

              <h4 className="redeemed-stat-value">
                {totalUsers ?? 0}
              </h4>

              <p className="redeemed-small-text">
                reward recipients
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default RedeemedCodes;