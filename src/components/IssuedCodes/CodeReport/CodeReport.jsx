import "./CodeReport.css";
import { useEffect, useState } from "react";

import {
    HiOutlineArrowLeft,
    HiOutlineArrowDownTray,
    HiOutlineMagnifyingGlass,
    HiOutlineXMark,
} from "react-icons/hi2";

const CodeReport = ({ clientId, token, onBack }) => {

    // =========================================================
    // API BASE URL
    // =========================================================

    const API_BASE =
        import.meta.env.VITE_API_URL ||
        "https://api.truvish.com";


    // =========================================================
    // HELPER: GET FULL IMAGE URL
    // =========================================================

    const getImageUrl = (path) => {

        if (!path || typeof path !== "string") {
            return "";
        }

        const cleanPath = path.trim();

        if (!cleanPath) {
            return "";
        }


        // =====================================================
        // OLD LOCALHOST URL
        // Example:
        // http://localhost:8080/uploads/image.jpg
        // =====================================================

        if (
            cleanPath.startsWith("http://localhost:8080") ||
            cleanPath.startsWith("https://localhost:8080") ||
            cleanPath.startsWith("http://127.0.0.1:8080") ||
            cleanPath.startsWith("https://127.0.0.1:8080")
        ) {

            const uploadsIndex =
                cleanPath.indexOf("/uploads/");

            if (uploadsIndex !== -1) {

                return (
                    API_BASE +
                    cleanPath.substring(uploadsIndex)
                );

            }

            return "";
        }


        // =====================================================
        // HTTP URL
        // Convert HTTP to HTTPS
        // =====================================================

        if (cleanPath.startsWith("http://")) {

            try {

                const url = new URL(cleanPath);

                if (
                    url.hostname === "api.truvish.com"
                ) {

                    return (
                        "https://" +
                        cleanPath.substring(7)
                    );

                }

                return cleanPath.replace(
                    /^http:\/\//i,
                    "https://"
                );

            } catch (error) {

                console.error(
                    "Invalid image URL:",
                    cleanPath
                );

                return "";
            }
        }


        // =====================================================
        // HTTPS URL
        // =====================================================

        if (cleanPath.startsWith("https://")) {
            return cleanPath;
        }


        // =====================================================
        // /uploads/image.jpg
        // =====================================================

        if (
            cleanPath.startsWith("/uploads/")
        ) {

            return API_BASE + cleanPath;

        }


        // =====================================================
        // uploads/image.jpg
        // =====================================================

        if (
            cleanPath.startsWith("uploads/")
        ) {

            return (
                API_BASE +
                "/" +
                cleanPath
            );

        }


        // =====================================================
        // ONLY FILE NAME
        // Example:
        // image.jpg
        // =====================================================

        return (
            API_BASE +
            "/uploads/" +
            cleanPath
        );
    };


    // =========================================================
    // STATE
    // =========================================================

    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [entriesPerPage, setEntriesPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");


    // =========================================================
    // LOAD CODE REPORT
    // =========================================================

    useEffect(() => {

        const loadCodeReport = async () => {

            if (!clientId || !token) {

                console.error(
                    "Client ID or token missing"
                );

                setCodes([]);
                setLoading(false);

                return;
            }


            try {

                setLoading(true);


                const response = await fetch(
                    `${API_BASE}/api/corporate/code-report/${clientId}`,
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


                console.log(
                    "Code Report API Status:",
                    response.status
                );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Code Report API Error:",
                        errorText
                    );

                    throw new Error(
                        `Code Report request failed: ${response.status}`
                    );
                }


                const data =
                    await response.json();


                console.log(
                    "Code Report API Response:",
                    data
                );


                // =================================================
                // FORMAT BACKEND DATA
                // =================================================

                const formattedData =
                    Array.isArray(data)
                        ? data.map(
                            (item, index) => ({

                                id:
                                    `${item.code || "code"}-${index}`,

                                code:
                                    item.code || "-",

                                denomination:
                                    item.denomination ?? "-",

                                status:
                                    item.status || "-",

                                issuedDateTime:
                                    item.issuedDateTime,

                                validityPeriod:
                                    item.validityPeriod,

                                expiryDate:
                                    item.expiryDate,

                                campaignName:
                                    item.campaignName,

                                theme:
                                    item.theme,

                                redeemedBy:
                                    item.redeemedBy,

                            })
                        )
                        : [];


                setCodes(formattedData);

            } catch (error) {

                console.error(
                    "Error loading code report:",
                    error
                );

                setCodes([]);

            } finally {

                setLoading(false);

            }

        };


        loadCodeReport();

    }, [clientId, token]);


    // =========================================================
    // FORMAT CODE
    // Example:
    // 813E-65DF-2E7D
    // =>
    // 813E XXXX 2E7D
    // =========================================================

    const formatCode = (code) => {

        if (!code) {
            return "-";
        }

        const cleanCode =
            String(code)
                .replace(
                    /[^a-zA-Z0-9]/g,
                    ""
                )
                .toUpperCase();

        if (cleanCode.length <= 8) {
            return cleanCode;
        }

        const firstFour =
            cleanCode.slice(0, 4);

        const lastFour =
            cleanCode.slice(-4);

        return `${firstFour} XXXX ${lastFour}`;
    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateTime) => {

        if (!dateTime) {
            return "-";
        }

        const date =
            new Date(dateTime);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateTime;

        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "-";
        }

        const date =
            new Date(dateTime);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "-";

        }

        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );
    };


    // =========================================================
    // FORMAT ISSUED DATE & TIME
    // =========================================================

    const formatIssuedDateTime = (
        dateTime
    ) => {

        if (!dateTime) {
            return "-";
        }

        return `${formatDate(
            dateTime
        )}, ${formatTime(
            dateTime
        )}`;
    };


    // =========================================================
    // FILTER
    // =========================================================

    const filteredCodes =
        codes.filter((item) => {

            const term =
                searchTerm
                    .toLowerCase()
                    .trim();

            if (!term) {
                return true;
            }

            return (

                String(
                    item.id || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.code || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    formatCode(
                        item.code
                    )
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.denomination ?? ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.status || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.issuedDateTime || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.validityPeriod || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.expiryDate || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.campaignName || ""
                )
                    .toLowerCase()
                    .includes(term)

                ||

                String(
                    item.redeemedBy || ""
                )
                    .toLowerCase()
                    .includes(term)

            );

        });


    // =========================================================
    // RESET SELECTION
    // =========================================================

    useEffect(() => {

        const validIds =
            filteredCodes.map(
                (item) =>
                    item.id
            );

        setSelectedIds(
            (prev) =>
                prev.filter(
                    (id) =>
                        validIds.includes(id)
                )
        );

        if (
            filteredCodes.length === 0
        ) {

            setSelectAll(false);

        }

    }, [
        searchTerm,
        codes,
    ]);


    // =========================================================
    // SELECT SINGLE
    // =========================================================

    const handleSelect = (id) => {

        setSelectedIds(
            (prev) => {

                const newSelection =
                    prev.includes(id)

                        ? prev.filter(
                            (item) =>
                                item !== id
                        )

                        : [
                            ...prev,
                            id,
                        ];


                setSelectAll(
                    newSelection.length ===
                    filteredCodes.length &&
                    filteredCodes.length > 0
                );


                return newSelection;

            }
        );

    };


    // =========================================================
    // SELECT ALL
    // =========================================================

    const handleSelectAll = () => {

        const newSelectAll =
            !selectAll;

        setSelectAll(
            newSelectAll
        );

        setSelectedIds(
            newSelectAll
                ? filteredCodes.map(
                    (item) =>
                        item.id
                )
                : []
        );

    };


    // =========================================================
    // DOWNLOAD CSV
    // =========================================================

    const handleDownload = () => {

        const headers = [
            "#",
            "Codes",
            "Denomination",
            "Status",
            "Issued Date & Time",
            "Validity Period",
            "Expiry Date",
            "Campaign Name",
            "Theme",
            "Redeemed By",
        ];


        const rows =
            codes.map(
                (item, index) => [

                    index + 1,

                    formatCode(
                        item.code
                    ),

                    item.denomination,

                    item.status,

                    formatIssuedDateTime(
                        item.issuedDateTime
                    ),

                    item.validityPeriod,

                    formatDate(
                        item.expiryDate
                    ),

                    item.campaignName,

                    item.theme || "-",

                    item.redeemedBy || "-",

                ]
            );


        const csvContent =
            "data:text/csv;charset=utf-8," +
            [
                headers.join(","),

                ...rows.map(
                    (row) =>
                        row
                            .map(
                                (value) =>
                                    `"${String(
                                        value ?? ""
                                    ).replaceAll(
                                        '"',
                                        '""'
                                    )}"`
                            )
                            .join(",")
                ),

            ].join("\n");


        const encodedUri =
            encodeURI(
                csvContent
            );


        const link =
            document.createElement(
                "a"
            );


        link.setAttribute(
            "href",
            encodedUri
        );


        link.setAttribute(
            "download",
            "code_report.csv"
        );


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );

    };


    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (
        status
    ) => {

        switch (status) {

            case "Redeemed":
                return "status-redeemed";

            case "Active":
                return "status-active";

            case "Expired":
                return "status-expired";

            case "Expired-Back to wallet":
                return "status-expired";

            default:
                return "";

        }

    };


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalEntries =
        filteredCodes.length;


    const totalPages =
        Math.ceil(
            totalEntries /
            entriesPerPage
        ) || 1;


    const startIndex =
        (currentPage - 1) *
        entriesPerPage;


    const endIndex =
        Math.min(
            startIndex +
            entriesPerPage,
            totalEntries
        );


    const currentEntries =
        filteredCodes.slice(
            startIndex,
            endIndex
        );


    // =========================================================
    // PAGE
    // =========================================================

    const goToPage = (
        page
    ) => {

        if (
            page >= 1 &&
            page <= totalPages
        ) {

            setCurrentPage(
                page
            );

        }

    };


    // =========================================================
    // ENTRIES CHANGE
    // =========================================================

    const handleEntriesChange = (
        e
    ) => {

        const value =
            parseInt(
                e.target.value,
                10
            );

        setEntriesPerPage(
            value
        );

        setCurrentPage(1);

    };


    // =========================================================
    // SEARCH PAGE RESET
    // =========================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        searchTerm,
    ]);


    // =========================================================
    // PAGE SAFETY
    // =========================================================

    useEffect(() => {

        if (
            currentPage >
            totalPages
        ) {

            setCurrentPage(
                totalPages
            );

        }

    }, [
        currentPage,
        totalPages,
    ]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="code-report-loading">
                Loading code report...
            </div>
        );

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="code-report-wrapper">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="code-report-header">

                <div className="code-report-breadcrumb">


                    {/* BACK */}

                    <button
                        className="code-report-back"
                        onClick={onBack}
                        aria-label="Go back to Dashboard"
                    >

                        <HiOutlineArrowLeft />

                        <span>
                            Back
                        </span>

                    </button>


                    {/* TITLE */}

                    <div className="code-report-title-group">

                        <h1 className="code-report-title">
                            Code Report
                        </h1>

                        <p className="code-report-subtitle">
                            View and manage all issued codes
                        </p>

                    </div>


                    {/* DOWNLOAD */}

                    <button
                        className="code-report-download"
                        onClick={
                            handleDownload
                        }
                        aria-label="Download CSV"
                    >

                        <HiOutlineArrowDownTray />

                        <span>
                            Download
                        </span>

                    </button>

                </div>


                {/* SEARCH */}

                <div className="code-report-search-container">

                    <div className="code-report-search">

                        <HiOutlineMagnifyingGlass
                            className="search-icon"
                            size={20}
                        />


                        <input
                            type="text"
                            placeholder="Search by ID, Code, Validity Period, Date..."
                            value={
                                searchTerm
                            }
                            onChange={(
                                e
                            ) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            aria-label="Search codes"
                        />


                        {searchTerm && (

                            <button
                                className="clear-btn"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                aria-label="Clear search"
                            >

                                <HiOutlineXMark
                                    size={18}
                                />

                            </button>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="code-report-table-container">


                {totalEntries === 0 ? (

                    <div className="code-report-no-results">

                        <span className="no-results-icon">
                            🔍
                        </span>

                        <div>

                            {searchTerm ? (

                                <>
                                    No codes match{" "}

                                    <strong>
                                        "{searchTerm}"
                                    </strong>

                                    . Try adjusting your search.
                                </>

                            ) : (

                                <>
                                    No code reports found.
                                </>

                            )}

                        </div>

                    </div>

                ) : (

                    <>


                        {/* =================================================
                            TABLE SCROLL
                        ================================================= */}

                        <div className="code-report-table-scroll">

                            <table className="code-report-table">


                                {/* HEADER */}

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Codes
                                        </th>

                                        <th>
                                            Denomination
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Issued Date &amp; Time
                                        </th>

                                        <th>
                                            Validity Period
                                        </th>

                                        <th>
                                            Expiry Date
                                        </th>

                                        <th>
                                            Campaign Name
                                        </th>

                                        <th>
                                            Theme
                                        </th>

                                        <th>
                                            Redeemed By
                                        </th>

                                        <th className="select-header">

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectAll
                                                }
                                                onChange={
                                                    handleSelectAll
                                                }
                                                aria-label="Select all codes"
                                            />

                                        </th>

                                    </tr>

                                </thead>


                                {/* BODY */}

                                <tbody>

                                    {currentEntries.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >


                                                {/* # */}

                                                <td className="number-cell">

                                                    {
                                                        startIndex +
                                                        index +
                                                        1
                                                    }

                                                </td>


                                                {/* CODE */}

                                                <td className="code-cell">

                                                    {
                                                        formatCode(
                                                            item.code
                                                        )
                                                    }

                                                </td>


                                                {/* DENOMINATION */}

                                                <td className="denomination-cell">

                                                    {
                                                        item.denomination
                                                    }

                                                </td>


                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            item.status
                                                        )}`}
                                                    >

                                                        {
                                                            item.status
                                                        }

                                                    </span>

                                                </td>


                                                {/* ISSUED */}

                                                <td>

                                                    {
                                                        formatIssuedDateTime(
                                                            item.issuedDateTime
                                                        )
                                                    }

                                                </td>


                                                {/* VALIDITY */}

                                                <td>

                                                    {
                                                        item.validityPeriod ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* EXPIRY */}

                                                <td>

                                                    {
                                                        formatDate(
                                                            item.expiryDate
                                                        )
                                                    }

                                                </td>


                                                {/* CAMPAIGN */}

                                                <td>

                                                    {
                                                        item.campaignName ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* THEME */}

                                                <td className="theme-cell">

                                                    {item.theme ? (

                                                        <img
                                                            src={getImageUrl(
                                                                item.theme
                                                            )}
                                                            alt={
                                                                item.campaignName ||
                                                                "Theme"
                                                            }
                                                            className="theme-image"
                                                            onError={(
                                                                e
                                                            ) => {

                                                                console.error(
                                                                    "Theme image failed:",
                                                                    getImageUrl(
                                                                        item.theme
                                                                    )
                                                                );

                                                                e.currentTarget.style.display =
                                                                    "none";

                                                            }}
                                                        />

                                                    ) : (

                                                        <span>
                                                            -
                                                        </span>

                                                    )}

                                                </td>


                                                {/* REDEEMED BY */}

                                                <td>

                                                    {
                                                        item.redeemedBy ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* SELECT */}

                                                <td className="select-cell">

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedIds.includes(
                                                                item.id
                                                            )
                                                        }
                                                        onChange={() =>
                                                            handleSelect(
                                                                item.id
                                                            )
                                                        }
                                                    />

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="code-report-table-footer">

                            <div className="code-report-pagination">

                                <span className="pagination-info">

                                    Showing{" "}

                                    {
                                        totalEntries === 0
                                            ? 0
                                            : startIndex + 1
                                    }

                                    {" "}to{" "}

                                    {
                                        endIndex
                                    }

                                    {" "}of{" "}

                                    {
                                        totalEntries
                                    }

                                    {" "}entries

                                </span>


                                <div className="pagination-controls">


                                    {/* ENTRIES */}

                                    <select
                                        className="pagination-entries"
                                        value={
                                            entriesPerPage
                                        }
                                        onChange={
                                            handleEntriesChange
                                        }
                                    >

                                        <option value="6">
                                            6
                                        </option>

                                        <option value="10">
                                            10
                                        </option>

                                        <option value="25">
                                            25
                                        </option>

                                        <option value="50">
                                            50
                                        </option>

                                        <option value="100">
                                            100
                                        </option>

                                    </select>


                                    {/* PREVIOUS */}

                                    <button
                                        className="pagination-btn"
                                        onClick={() =>
                                            goToPage(
                                                currentPage - 1
                                            )
                                        }
                                        disabled={
                                            currentPage === 1
                                        }
                                    >
                                        Previous
                                    </button>


                                    {/* NEXT */}

                                    <button
                                        className="pagination-btn"
                                        onClick={() =>
                                            goToPage(
                                                currentPage + 1
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </div>

    );

};

export default CodeReport;
