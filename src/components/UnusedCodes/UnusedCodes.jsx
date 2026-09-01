import "./UnusedCodes.css";

import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";

const UnusedCodes = ({
  value,
  totalCodes,
  activeCodes,
  expiredCodes,
  isFlipped = false,
}) => {
  return (
    <div className={`unused-flip-wrapper ${isFlipped ? "is-flipped" : ""}`}>
      <div className="unused-flip-inner">

        {/* =====================================================
            FRONT - UNUSED CODES
        ===================================================== */}

        <div className="unused-card unused-front">

          <div className="unused-header">

            <div className="unused-icon">
              <MdOutlineInventory2 />
            </div>

            <div className="unused-arrow">
              <HiOutlineArrowUpRight />
            </div>

          </div>

          <h2 className="unused-title">
            Unused Codes
          </h2>

          <div className="unused-section">

            <span className="unused-label">
              Value
            </span>

            <h1 className="unused-value">
              <FaRupeeSign />

              <span>
                {value ?? 0}
              </span>
            </h1>

          </div>

          <div className="unused-divider"></div>

          <div className="unused-section">

            <span className="unused-label">
              Count
            </span>

            <h3 className="unused-count">
              {totalCodes ?? 0} Codes
            </h3>

          </div>

          <div className="unused-bottom">

            <div className="unused-stat">

              <span className="unused-small-title">
                Active Codes
              </span>

              <h4 className="unused-stat-value">
                {activeCodes ?? 0}
              </h4>

            </div>

            <div className="unused-stat">

              <span className="unused-small-title">
                Expired Codes
              </span>

              <h4 className="unused-stat-value">
                {expiredCodes ?? 0}
              </h4>

            </div>

          </div>

          <p className="unused-footer">
            Active &amp; expired codes
          </p>

        </div>


        {/* =====================================================
            BACK - UNUSED
        ===================================================== */}

        <div className="unused-card unused-back">

          <div className="unused-header">

            <div className="unused-icon">
              <MdOutlineInventory2 />
            </div>

            <div className="unused-arrow">
              <HiOutlineArrowUpRight />
            </div>

          </div>

          <h2 className="unused-title">
            Unused
          </h2>

          <div className="unused-section">

            <span className="unused-label">
              Value
            </span>

            <h1 className="unused-value">
              <FaRupeeSign />

              <span>
                {value ?? 0}
              </span>
            </h1>

          </div>

          <div className="unused-divider"></div>

          <div className="unused-section">

            <span className="unused-label">
              Count
            </span>

            <h3 className="unused-count">
              {totalCodes ?? 0} Codes
            </h3>

          </div>

          <div className="unused-bottom">

            <div className="unused-stat">

              <span className="unused-small-title">
                Active Codes
              </span>

              <h4 className="unused-stat-value">
                {activeCodes ?? 0}
              </h4>

            </div>

            <div className="unused-stat">

              <span className="unused-small-title">
                Expired Codes
              </span>

              <h4 className="unused-stat-value">
                {expiredCodes ?? 0}
              </h4>

            </div>

          </div>

          <p className="unused-footer">
            TruCard active &amp; expired codes
          </p>

        </div>

      </div>
    </div>
  );
};

export default UnusedCodes;