import "./TruIssued.css";

import {
    HiOutlineArrowUpRight,
    HiOutlineArrowRight,
} from "react-icons/hi2";

import { FaRupeeSign } from "react-icons/fa";

import {
    MdCardGiftcard,
    MdOutlineDescription,
} from "react-icons/md";


const TruIssued = ({
    value,
    totalCodes,
    onCodeView,
    onFlip,
}) => {

    const handleCodeView = () => {
        if (typeof onCodeView === "function") {
            onCodeView();
        }
    };


    return (
        <div className="tru-issued-card">

            {/* HEADER */}
            <div className="tru-issued-header">

                <div className="tru-issued-icon">
                    <MdCardGiftcard />
                </div>

                <button
                    type="button"
                    className="tru-issued-flip"
                    onClick={onFlip}
                    aria-label="Flip TruCard summary"
                    title="Flip"
                >
                    <HiOutlineArrowUpRight />
                </button>

            </div>


            {/* TITLE */}
            <h2 className="tru-issued-title">
                Active Tru Cards
            </h2>


            {/* VALUE */}
            <div className="tru-issued-section">

                <span className="tru-issued-label">
                    Value
                </span>

                <h1 className="tru-issued-value">

                    <FaRupeeSign />

                    <span>
                        {value ?? 0}
                    </span>

                </h1>

            </div>


            {/* DIVIDER */}
            <div className="tru-issued-divider"></div>


            {/* COUNT */}
            <div className="tru-issued-section">

                <span className="tru-issued-label">
                    Count
                </span>

                <h3 className="tru-issued-count">
                    {totalCodes ?? 0} Codes
                </h3>

            </div>


            {/* TRUCARD CODE REPORT */}
            <button
                type="button"
                className="tru-issued-code-view"
                onClick={handleCodeView}
            >

                <div className="tru-issued-code-icon">
                    <MdOutlineDescription />
                </div>

                <span className="tru-issued-code-text">
                    TruCard Code Report
                </span>

                <div className="tru-issued-code-arrow">
                    <HiOutlineArrowRight />
                </div>

            </button>


            {/* FOOTER */}
            <p className="tru-issued-footer">
                TruCard codes issued till date
            </p>

        </div>
    );
};


export default TruIssued;