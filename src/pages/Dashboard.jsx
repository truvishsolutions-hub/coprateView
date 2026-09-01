import "./Dashboard.css";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import EnterpriseAccount from "../components/EnterpriseAccount/EnterpriseAccount";
import Wallet from "../components/Wallet/Wallet";
import Cashback from "../components/Cashback/Cashback";

import IssuedCodes from "../components/IssuedCodes/IssuedCodes";
import RedeemedCodes from "../components/RedeemedCodes/RedeemedCodes";
import UnusedCodes from "../components/UnusedCodes/UnusedCodes";

import CodeReport
  from "../components/IssuedCodes/CodeReport/CodeReport.jsx";

import TruCodeReport
  from "../components/TruIssued/TruCodeReport/TruCodeReport.jsx";


// ==========================================================
// API BASE URL
// IMPORTANT:
// Always use HTTPS in production.
// ==========================================================

const API_BASE = (
  import.meta.env.VITE_API_BASE ||
  "https://api.truvish.com"
).replace(/\/+$/, "");


function Dashboard({
  onLogout,
}) {

  // ==========================================================
  // ALL STATES
  // IMPORTANT:
  // KEEP ALL HOOKS AT TOP LEVEL
  // ==========================================================

  const [
    dashboard,
    setDashboard,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    showCodeReport,
    setShowCodeReport,
  ] = useState(false);


  const [
    showTruCodeReport,
    setShowTruCodeReport,
  ] = useState(false);


  const [
    isTruCardFlipped,
    setIsTruCardFlipped,
  ] = useState(false);


  // ==========================================================
  // CLIENT ID + TOKEN
  // ==========================================================

  const clientId =
    localStorage.getItem("clientId");


  const token =
    localStorage.getItem("token");


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard =
    useCallback(
      async () => {

        // ------------------------------------------------------
        // CLIENT ID / TOKEN CHECK
        // ------------------------------------------------------

        if (
          !clientId ||
          !token
        ) {

          console.error(
            "Client ID or token missing"
          );

          setDashboard(null);

          setLoading(false);

          if (
            typeof onLogout ===
            "function"
          ) {

            onLogout();
          }

          return;
        }


        try {

          setLoading(true);


          // ----------------------------------------------------
          // FINAL HTTPS API URL
          // ----------------------------------------------------

          const url =
            `${API_BASE}/api/corporate/dashboard/${clientId}`;


          console.log(
            "Loading Corporate Dashboard:",
            url
          );


          // ----------------------------------------------------
          // API REQUEST
          // ----------------------------------------------------

          const response =
            await fetch(
              url,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            );


          // ----------------------------------------------------
          // READ RESPONSE SAFELY
          // ----------------------------------------------------

          const responseText =
            await response.text();


          console.log(
            "Corporate Dashboard API Status:",
            response.status
          );


          console.log(
            "Corporate Dashboard API Response:",
            responseText
          );


          // ----------------------------------------------------
          // ERROR RESPONSE
          // ----------------------------------------------------

          if (
            !response.ok
          ) {

            let errorMessage =
              `Dashboard request failed: ${response.status}`;


            try {

              const errorData =
                responseText
                  ? JSON.parse(
                      responseText
                    )
                  : {};


              errorMessage =
                errorData.message ||
                errorData.error ||
                errorData.detail ||
                errorData.title ||
                errorMessage;

            } catch {

              if (
                responseText
              ) {

                errorMessage =
                  responseText;
              }
            }


            console.error(
              "Corporate Dashboard API Error:",
              errorMessage
            );


            throw new Error(
              errorMessage
            );
          }


          // ----------------------------------------------------
          // PARSE SUCCESS RESPONSE
          // ----------------------------------------------------

          let data = null;


          try {

            data =
              responseText
                ? JSON.parse(
                    responseText
                  )
                : null;

          } catch (
            parseError
          ) {

            console.error(
              "Corporate Dashboard JSON Parse Error:",
              parseError
            );

            throw new Error(
              "Invalid dashboard response from server"
            );
          }


          console.log(
            "Corporate Dashboard Response:",
            data
          );


          // ----------------------------------------------------
          // SAVE DASHBOARD DATA
          // ----------------------------------------------------

          setDashboard(
            data
          );

        } catch (
          error
        ) {

          console.error(
            "Corporate Dashboard Error:",
            error
          );


          setDashboard(
            null
          );

        } finally {

          setLoading(
            false
          );
        }

      },
      [
        clientId,
        token,
        onLogout,
      ]
    );


  // ==========================================================
  // LOAD DASHBOARD EFFECT
  // IMPORTANT:
  // THIS HOOK MUST STAY BEFORE CONDITIONAL RETURNS
  // ==========================================================

  useEffect(
    () => {

      loadDashboard();

    },
    [
      loadDashboard,
    ]
  );


  // ==========================================================
  // FLIP TRUCARD / DIGITAL CARDS
  // ==========================================================

  const handleFlipCards =
    () => {

      console.log(
        "TruCard cards flip:",
        !isTruCardFlipped
      );


      setIsTruCardFlipped(
        (previous) =>
          !previous
      );
    };


  // ==========================================================
  // OPEN DIGITAL CODE REPORT
  // ==========================================================

  const handleDigitalCodeReport =
    () => {

      console.log(
        "Digital Code Report clicked"
      );


      setShowCodeReport(
        true
      );


      setShowTruCodeReport(
        false
      );
    };


  // ==========================================================
  // OPEN TRUCARD CODE REPORT
  // ==========================================================

  const handleTruCodeReport =
    () => {

      console.log(
        "TruCard Code Report clicked"
      );


      console.log(
        "Physical report Client ID:",
        clientId
      );


      setShowTruCodeReport(
        true
      );


      setShowCodeReport(
        false
      );
    };


  // ==========================================================
  // CLOSE REPORTS
  // ==========================================================

  const closeReports =
    () => {

      setShowCodeReport(
        false
      );


      setShowTruCodeReport(
        false
      );
    };


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {

    return (

      <div
        className="
          dashboard-state
          dashboard-loading
        "
      >

        <div
          className="
            dashboard-loader
          "
        />

        <p>
          Loading Dashboard...
        </p>

      </div>
    );
  }


  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (!dashboard) {

    return (

      <div
        className="
          dashboard-state
          dashboard-error
        "
      >

        <div
          className="
            dashboard-error-icon
          "
        >
          !
        </div>


        <h3>
          Unable to load dashboard
        </h3>


        <p>
          Something went wrong while loading your
          corporate dashboard. Please try again.
        </p>


        <button
          type="button"
          className="
            dashboard-retry-btn
          "
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>

      </div>
    );
  }


  // ==========================================================
  // DIGITAL DASHBOARD VALUES
  // ==========================================================

  const digitalIssuedCodes =
    Number(
      dashboard.digitalIssuedCodes ??
      0
    );


  const digitalIssuedValue =
    Number(
      dashboard.digitalIssuedValue ??
      0
    );


  const digitalRedeemedCodes =
    Number(
      dashboard.digitalRedeemedCodes ??
      0
    );


  const digitalRedeemedValue =
    Number(
      dashboard.digitalRedeemedValue ??
      0
    );


  const digitalRedemptionRate =
    Number(
      dashboard.digitalRedemptionRate ??
      0
    );


  const digitalTotalUsers =
    Number(
      dashboard.digitalTotalUsers ??
      0
    );


  const digitalUnusedCodes =
    Number(
      dashboard.digitalUnusedCodes ??
      0
    );


  const digitalUnusedValue =
    Number(
      dashboard.digitalUnusedValue ??
      0
    );


  const digitalActiveCodes =
    Number(
      dashboard.digitalActiveCodes ??
      0
    );


  const digitalExpiredCodes =
    Number(
      dashboard.digitalExpiredCodes ??
      0
    );


  // ==========================================================
  // PHYSICAL TRUCARD VALUES
  // ==========================================================

  const truIssuedCodes =
    Number(
      dashboard.truIssuedCodes ??
      0
    );


  const truIssuedValue =
    Number(
      dashboard.truIssuedValue ??
      0
    );


  const truRedeemedCodes =
    Number(
      dashboard.truRedeemedCodes ??
      0
    );


  const truRedeemedValue =
    Number(
      dashboard.truRedeemedValue ??
      0
    );


  const truRedemptionRate =
    Number(
      dashboard.truRedemptionRate ??
      0
    );


  const truTotalUsers =
    Number(
      dashboard.truTotalUsers ??
      0
    );


  const truUnusedCodes =
    Number(
      dashboard.truUnusedCodes ??
      0
    );


  const truUnusedValue =
    Number(
      dashboard.truUnusedValue ??
      0
    );


  const truActiveCodes =
    Number(
      dashboard.truActiveCodes ??
      0
    );


  const truExpiredCodes =
    Number(
      dashboard.truExpiredCodes ??
      0
    );


  // ==========================================================
  // CURRENT CARD VALUES
  // ==========================================================

  const currentIssuedValue =
    isTruCardFlipped
      ? truIssuedValue
      : digitalIssuedValue;


  const currentIssuedCodes =
    isTruCardFlipped
      ? truIssuedCodes
      : digitalIssuedCodes;


  const currentRedeemedValue =
    isTruCardFlipped
      ? truRedeemedValue
      : digitalRedeemedValue;


  const currentRedeemedCodes =
    isTruCardFlipped
      ? truRedeemedCodes
      : digitalRedeemedCodes;


  const currentRedemptionRate =
    isTruCardFlipped
      ? truRedemptionRate
      : digitalRedemptionRate;


  const currentTotalUsers =
    isTruCardFlipped
      ? truTotalUsers
      : digitalTotalUsers;


  const currentUnusedValue =
    isTruCardFlipped
      ? truUnusedValue
      : digitalUnusedValue;


  const currentUnusedCodes =
    isTruCardFlipped
      ? truUnusedCodes
      : digitalUnusedCodes;


  const currentActiveCodes =
    isTruCardFlipped
      ? truActiveCodes
      : digitalActiveCodes;


  const currentExpiredCodes =
    isTruCardFlipped
      ? truExpiredCodes
      : digitalExpiredCodes;


  // ==========================================================
  // CONTENT
  // ==========================================================

  let content;


  // ==========================================================
  // DIGITAL REPORT
  // ==========================================================

  if (
    showCodeReport
  ) {

    content = (

      <CodeReport
        clientId={
          clientId
        }

        token={
          token
        }

        onBack={
          closeReports
        }
      />

    );

  }


  // ==========================================================
  // PHYSICAL TRUCARD REPORT
  // ==========================================================

  else if (
    showTruCodeReport
  ) {

    content = (

      <TruCodeReport
        clientId={
          clientId
        }

        token={
          token
        }

        onBack={
          closeReports
        }
      />

    );

  }


  // ==========================================================
  // MAIN DASHBOARD CONTENT
  // ==========================================================

  else {

    content = (

      <>

        {/* ====================================================
            WALLET + CASHBACK
        ==================================================== */}

        <div
          className="
            dashboard-summary
          "
        >

          <Wallet
            balance={
              dashboard.walletBalance
            }

            title="TruBalance"

            label="Wallet"

            description="
              Available reward balance across active campaigns
            "

            footer="Managed by TruVish"
          />


          <Cashback
            cashback={
              dashboard.cashback
            }

            thisMonth={
              dashboard.thisMonth
            }

            title="TruCashback"

            label="Value Returned"

            description="
              Cashback earned through reward activity
            "

            footer="Earned Till Date"
          />

        </div>


        {/* ====================================================
            CODE OVERVIEW
        ==================================================== */}

        <div
          className="
            dashboard-section
          "
        >

          <div
            className="
              dashboard-section-header
            "
          >

            <div>

              <h2>
                Code Overview
              </h2>

              <p>
                Monitor issued, redeemed and unused TruCard codes.
              </p>

            </div>

          </div>


          <div
            className="
              dashboard-cards
            "
          >

            {/* =================================================
                ISSUED CODES
            ================================================= */}

            <IssuedCodes
              value={
                currentIssuedValue
              }

              totalCodes={
                currentIssuedCodes
              }

              isFlipped={
                isTruCardFlipped
              }

              onFlip={
                handleFlipCards
              }

              onCodeView={
                handleDigitalCodeReport
              }

              onTruCodeView={
                handleTruCodeReport
              }
            />


            {/* =================================================
                REDEEMED CODES
            ================================================= */}

            <RedeemedCodes
              value={
                currentRedeemedValue
              }

              totalCodes={
                currentRedeemedCodes
              }

              redemptionRate={
                currentRedemptionRate
              }

              totalUsers={
                currentTotalUsers
              }

              isFlipped={
                isTruCardFlipped
              }
            />


            {/* =================================================
                UNUSED CODES
            ================================================= */}

            <UnusedCodes
              value={
                currentUnusedValue
              }

              totalCodes={
                currentUnusedCodes
              }

              activeCodes={
                currentActiveCodes
              }

              expiredCodes={
                currentExpiredCodes
              }

              isFlipped={
                isTruCardFlipped
              }
            />

          </div>

        </div>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            dashboard-footer
          "
        >

          <p>

            TruVish Enterprise Dashboard

            <span>
              {" • "}
            </span>

            Reward activity and TruCard code management

          </p>

        </div>

      </>

    );
  }


  // ==========================================================
  // MAIN RETURN
  // ==========================================================

  return (

    <div
      className="
        dashboard-wrapper
      "
    >

      <div
        className="
          dashboard-container
        "
      >

        {/* ====================================================
            ENTERPRISE ACCOUNT
        ==================================================== */}

        <EnterpriseAccount

          clientLogo={
            dashboard.logoImg
          }

          clientName={
            dashboard.companyName
          }

          companyType={
            dashboard.companyType
          }

          subTitle={
            dashboard.subTitle
          }

          onLogout={
            onLogout
          }

        />


        {/* ====================================================
            DYNAMIC CONTENT
        ==================================================== */}

        {content}

      </div>

    </div>
  );
}


export default Dashboard;