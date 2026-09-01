import "./TruUnusedCodes.css";

import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FaRupeeSign } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";


const TruUnusedCodes = ({
    value,
    totalCodes,
    activeCodes,
    expiredCodes,
}) => {

    return (

        <div className="tru-unused-card">

            {/* HEADER */}
            <div className="tru-unused-header">

                <div className="tru-unused-icon">
                    <MdPendingActions />
                </div>

                <div className="tru-unused-arrow">
                    <HiOutlineArrowUpRight />
                </div>

            </div>


            {/* TITLE */}
            <h2 className="tru-unused-title">
                Unused
            </h2>


            {/* VALUE */}
            <div className="tru-unused-section">

                <span className="tru-unused-label">
                    Value
                </span>

                <h1 className="tru-unused-value">

                    <FaRupeeSign />

                    <span>
                        {value ?? 0}
                    </span>

                </h1>

            </div>


            {/* DIVIDER */}
            <div className="tru-unused-divider"></div>


            {/* COUNT */}
            <div className="tru-unused-section">

                <span className="tru-unused-label">
                    Count
                </span>

                <h3 className="tru-unused-count">
                    {totalCodes ?? 0} Codes
                </h3>

            </div>


            {/* BOTTOM STATS */}
            <div className="tru-unused-bottom">

                <div className="tru-unused-stat">

                    <span className="tru-unused-small-title">
                        Active Codes
                    </span>

                    <h4 className="tru-unused-stat-value">
                        {activeCodes ?? 0}
                    </h4>

                </div>


                <div className="tru-unused-stat">

                    <span className="tru-unused-small-title">
                        Expired Codes
                    </span>

                    <h4 className="tru-unused-stat-value">
                        {expiredCodes ?? 0}
                    </h4>

                </div>

            </div>


            {/* FOOTER */}
            <p className="tru-unused-footer">
                TruCard active & expired codes
            </p>

        </div>

    );
};


export default TruUnusedCodes;