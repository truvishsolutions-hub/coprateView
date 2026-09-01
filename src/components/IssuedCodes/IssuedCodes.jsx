import "./IssuedCodes.css";

import {
  HiOutlineArrowUpRight,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import { FaRupeeSign } from "react-icons/fa";

import {
  MdCardGiftcard,
  MdOutlineDescription,
} from "react-icons/md";

const IssuedCodes = ({
  value,
  totalCodes,
  onCodeView,        // front side -> digital report
  onTruCodeView,     // back side -> TruCard report
  onFlip,
  isFlipped = false,
}) => {
  const handleCodeView = () => {
    console.log("IssuedCodes: Code Report clicked");
    if (typeof onCodeView === "function") {
      onCodeView();
    }
  };

  const handleTruCodeView = () => {
    console.log("IssuedCodes: TruCard Code Report clicked");
    if (typeof onTruCodeView === "function") {
      onTruCodeView();
    }
  };

  return (
    <div className={`issued-flip-wrapper ${isFlipped ? "is-flipped" : ""}`}>
      <div className="issued-flip-inner">

        {/* =====================================================
            FRONT - ISSUED CODES
        ===================================================== */}

        <div className="issued-card issued-front">

          {/* HEADER */}
          <div className="issued-header">

            <div className="issued-icon">
              <MdCardGiftcard />
            </div>

            {/* FLIP BUTTON */}
            <button
              type="button"
              className="issued-arrow issued-flip-button"
              onClick={onFlip}
              aria-label="Flip TruCard overview"
              title="Flip"
            >
              <HiOutlineArrowUpRight />
            </button>

          </div>

          {/* TITLE */}
          <h2 className="issued-title">
            Issued Codes
          </h2>

          {/* VALUE */}
          <div className="issued-section">

            <span className="issued-label">
              Value
            </span>

            <h1 className="issued-value">
              <FaRupeeSign />

              <span>
                {value ?? 0}
              </span>
            </h1>

          </div>

          {/* DIVIDER */}
          <div className="issued-divider"></div>

          {/* COUNT */}
          <div className="issued-section">

            <span className="issued-label">
              Count
            </span>

            <h3 className="issued-count">
              {totalCodes ?? 0} Codes
            </h3>

          </div>

          {/* CODE REPORT (front) */}
          <button
            type="button"
            className="issued-code-view"
            onClick={handleCodeView}
            aria-label="Open Code Report"
          >

            <div className="code-view-icon">
              <MdOutlineDescription />
            </div>

            <span className="code-view-text">
              Code Report
            </span>

            <div className="code-view-arrow">
              <HiOutlineArrowRight />
            </div>

          </button>

          {/* FOOTER */}
          <p className="issued-footer">
            Codes issued till date
          </p>

        </div>


        {/* =====================================================
            BACK - ACTIVE TRU CARDS
        ===================================================== */}

        <div className="issued-card issued-back">

          {/* HEADER */}
          <div className="issued-header">

            <div className="issued-icon">
              <MdCardGiftcard />
            </div>

            <button
              type="button"
              className="issued-arrow issued-flip-button"
              onClick={onFlip}
              aria-label="Flip back"
              title="Flip back"
            >
              <HiOutlineArrowUpRight />
            </button>

          </div>

          {/* TITLE */}
          <h2 className="issued-title">
            Active Tru Cards
          </h2>

          {/* VALUE */}
          <div className="issued-section">

            <span className="issued-label">
              Value
            </span>

            <h1 className="issued-value">
              <FaRupeeSign />

              <span>
                {value ?? 0}
              </span>
            </h1>

          </div>

          {/* DIVIDER */}
          <div className="issued-divider"></div>

          {/* COUNT */}
          <div className="issued-section">

            <span className="issued-label">
              Count
            </span>

            <h3 className="issued-count">
              {totalCodes ?? 0} Codes
            </h3>

          </div>

          {/* TRUCARD CODE REPORT (back) */}
          <button
            type="button"
            className="issued-code-view"
            onClick={handleTruCodeView}
            aria-label="Open TruCard Code Report"
          >

            <div className="code-view-icon">
              <MdOutlineDescription />
            </div>

            <span className="code-view-text">
              TruCard Code Report
            </span>

            <div className="code-view-arrow">
              <HiOutlineArrowRight />
            </div>

          </button>

          {/* FOOTER */}
          <p className="issued-footer">
            TruCard codes issued till date
          </p>

        </div>

      </div>
    </div>
  );
};

export default IssuedCodes;