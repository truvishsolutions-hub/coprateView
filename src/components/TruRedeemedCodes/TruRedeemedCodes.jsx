import "./TruRedeemedCodes.css";

import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FaRupeeSign } from "react-icons/fa";
import { MdVerified } from "react-icons/md";


const TruRedeemedCodes = ({
    value,
    totalCodes,
    redemptionRate,
    totalUsers,
}) => {

    return (

        <div className="tru-redeemed-card">

            {/* HEADER */}
            <div className="tru-redeemed-header">

                <div className="tru-redeemed-icon">
                    <MdVerified />
                </div>

                <div className="tru-redeemed-arrow">
                    <HiOutlineArrowUpRight />
                </div>

            </div>


            {/* TITLE */}
            <h2 className="tru-redeemed-title">
                Redeemed
            </h2>


            {/* VALUE */}
            <div className="tru-redeemed-section">

                <span className="tru-redeemed-label">
                    Value
                </span>

                <h1 className="tru-redeemed-value">

                    <FaRupeeSign />

                    <span>
                        {value ?? 0}
                    </span>

                </h1>

            </div>


            {/* DIVIDER */}
            <div className="tru-redeemed-divider"></div>


            {/* COUNT */}
            <div className="tru-redeemed-section">

                <span className="tru-redeemed-label">
                    Count
                </span>

                <h3 className="tru-redeemed-count">
                    {totalCodes ?? 0} Codes
                </h3>

            </div>


            {/* BOTTOM STATS */}
            <div className="tru-redeemed-bottom">

                <div className="tru-redeemed-stat">

                    <span className="tru-redeemed-small-title">
                        Redemption %
                    </span>

                    <h4 className="tru-redeemed-stat-value">
                        {redemptionRate ?? 0}%
                    </h4>

                    <p className="tru-redeemed-small-text">
                        of issued codes
                    </p>

                </div>


                <div className="tru-redeemed-stat">

                    <span className="tru-redeemed-small-title">
                        Total Users
                    </span>

                    <h4 className="tru-redeemed-stat-value">
                        {totalUsers ?? 0}
                    </h4>

                    <p className="tru-redeemed-small-text">
                        reward recipients
                    </p>

                </div>

            </div>

        </div>

    );
};


export default TruRedeemedCodes;