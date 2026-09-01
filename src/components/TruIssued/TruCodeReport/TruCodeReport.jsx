import "./TruCodeReport.css";

import { useEffect, useMemo, useState } from "react";

import {
  HiOutlineArrowLeft,
  HiOutlineArrowDownTray,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
} from "react-icons/hi2";

const TruCodeReport = ({
  clientId,
  token,
  onBack,
}) => {
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
  // NORMALIZE STATUS
  // =========================================================

  const normalizeStatus = (status) => {
    if (!status) return "-";
    const value = String(status).trim().toLowerCase();
    if (value === "redeemed") return "Redeemed";
    if (value === "active") return "Active";
    if (value === "inactive") return "Inactive";
    if (value === "expired") return "Expired";
    if (value === "cancelled" || value === "canceled") return "Cancelled";
    return String(status);
  };

  // =========================================================
  // BUILD IMAGE URL (if relative)
  // =========================================================

  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (path.startsWith("/")) {
      return `http://localhost:8080${path}`;
    }
    return `http://localhost:8080/uploads/${path}`;
  };

  // =========================================================
  // LOAD PHYSICAL TRUCARD REPORT
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadPhysicalReport = async () => {
      if (!clientId || !token) {
        console.error("TruCard Code Report: Client ID or token missing");
        if (!cancelled) {
          setCodes([]);
          setLoading(false);
        }
        return;
      }

      try {
        if (!cancelled) setLoading(true);

        const url = `http://localhost:8080/api/admin/tru-blank-code/client/${clientId}`;
        console.log("Loading PHYSICAL TruCard report from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("TruCard Code Report API Error:", errorText);
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Physical TruCard report API response:", data);

        const items = Array.isArray(data) ? data : [];

        // Map to table format – now using item.redeemedBy
        const formattedData = items.map((item) => ({
          id: item.id,
          serialNumber: item.serialNumber || "-",
          code: item.codeNumber || "-",
          denomination: item.denomination || 0,
          status: normalizeStatus(item.status),
          issuedDateTime: item.createdAt || null,
          validityMonths: item.validityMonths || null,
          expiryDate: item.expiryDate || null,
          campaignName: item.clientTheme || "-",
          theme: buildImageUrl(item.clientThemeImg || item.themeImg),
          redeemedBy: item.redeemedBy || "-",   // <--- NOW FROM API
          rawStatus: item.status,
        }));

        console.log("Formatted physical TruCard data:", formattedData);

        if (!cancelled) {
          setCodes(formattedData);
          setSelectedIds([]);
          setSelectAll(false);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Error loading physical TruCard report:", error);
        if (!cancelled) {
          setCodes([]);
          setSelectedIds([]);
          setSelectAll(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPhysicalReport();

    return () => {
      cancelled = true;
    };
  }, [clientId, token]);

  // =========================================================
  // FORMAT CODE (mask)
  // =========================================================

  const formatCode = (code) => {
    if (!code) return "-";
    const cleanCode = String(code).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (cleanCode.length <= 8) return cleanCode;
    const firstFour = cleanCode.slice(0, 4);
    const lastFour = cleanCode.slice(-4);
    return `${firstFour} XXXX ${lastFour}`;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return String(dateTime);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatIssuedDateTime = (dateTime) => {
    if (!dateTime) return "-";
    return `${formatDate(dateTime)}, ${formatTime(dateTime)}`;
  };

  // =========================================================
  // FORMAT VALIDITY PERIOD
  // =========================================================

  const formatValidityPeriod = (months) => {
    if (!months) return "-";
    if (months === 1) return "1 Month";
    return `${months} Months`;
  };

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const filteredCodes = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return codes;

    return codes.filter((item) => {
      const searchable = [
        item.id,
        item.serialNumber,
        item.code,
        formatCode(item.code),
        item.denomination,
        item.status,
        item.issuedDateTime,
        formatIssuedDateTime(item.issuedDateTime),
        formatValidityPeriod(item.validityMonths),
        item.expiryDate,
        formatDate(item.expiryDate),
        item.campaignName,
        item.redeemedBy,
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());

      return searchable.some((field) => field.includes(term));
    });
  }, [codes, searchTerm]);

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // =========================================================
  // SELECTION
  // =========================================================

  useEffect(() => {
    const validIds = new Set(filteredCodes.map((item) => String(item.id)));
    setSelectedIds((prev) => prev.filter((id) => validIds.has(String(id))));
    if (filteredCodes.length === 0) {
      setSelectAll(false);
    } else {
      setSelectAll(filteredCodes.every((item) => selectedIds.includes(item.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCodes]);

  const handleSelect = (id) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(id);
      const newSelection = exists
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      setSelectAll(
        newSelection.length === filteredCodes.length && filteredCodes.length > 0
      );
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedIds(newSelectAll ? filteredCodes.map((item) => item.id) : []);
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case "Redeemed":
        return "status-redeemed";
      case "Active":
        return "status-active";
      case "Expired":
        return "status-expired";
      case "Cancelled":
      case "Inactive":
        return "status-expired";
      default:
        return "";
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalEntries = filteredCodes.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentEntries = filteredCodes.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  // =========================================================
  // DOWNLOAD CSV
  // =========================================================

  const handleDownload = () => {
    if (!codes.length) {
      console.warn("No TruCard codes available for download.");
      return;
    }

    const headers = [
      "#",
      "Serial Number",
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

    const rows = codes.map((item, index) => [
      index + 1,
      item.serialNumber ?? "-",
      formatCode(item.code),
      item.denomination ?? "-",
      item.status ?? "-",
      formatIssuedDateTime(item.issuedDateTime),
      formatValidityPeriod(item.validityMonths),
      formatDate(item.expiryDate),
      item.campaignName ?? "-",
      item.theme ?? "-",
      item.redeemedBy ?? "-",
    ]);

    const csvRows = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ];

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "trucard_code_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <div className="code-report-loading">Loading TruCard code report...</div>;
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="code-report-wrapper">
      {/* HEADER */}
      <div className="code-report-header">
        <div className="code-report-breadcrumb">
          <button
            type="button"
            className="code-report-back"
            onClick={onBack}
            aria-label="Go back"
          >
            <HiOutlineArrowLeft />
            <span>Back</span>
          </button>

          <div className="code-report-title-group">
            <h1 className="code-report-title">TruCard Code Report</h1>
            <p className="code-report-subtitle">
              View and manage all physical TruCard codes
            </p>
          </div>

          <button
            type="button"
            className="code-report-download"
            onClick={handleDownload}
            disabled={codes.length === 0}
            aria-label="Download CSV"
          >
            <HiOutlineArrowDownTray />
            <span>Download</span>
          </button>
        </div>

        {/* SEARCH */}
        <div className="code-report-search-container">
          <div className="code-report-search">
            <HiOutlineMagnifyingGlass className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by Serial Number, Code, Status, Validity, Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search TruCard codes"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <HiOutlineXMark size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="code-report-table-container">
        {totalEntries === 0 ? (
          <div className="code-report-no-results">
            <span className="no-results-icon">🔍</span>
            <div>
              {searchTerm ? (
                <>
                  No TruCard codes match <strong>"{searchTerm}"</strong>. Try
                  adjusting your search.
                </>
              ) : (
                <>No physical TruCard codes found for this client.</>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="code-report-table-scroll">
              <table className="code-report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Serial Number</th>
                    <th>Codes</th>
                    <th>Denomination</th>
                    <th>Status</th>
                    <th>Issued Date &amp; Time</th>
                    <th>Validity Period</th>
                    <th>Expiry Date</th>
                    <th>Campaign Name</th>
                    <th>Theme</th>
                    <th>Redeemed By</th>
                    <th className="select-header">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        aria-label="Select all TruCard codes"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((item, index) => (
                    <tr key={item.id}>
                      <td className="number-cell">{startIndex + index + 1}</td>
                      <td className="serial-cell">
                        {item.serialNumber ?? "-"}
                      </td>
                      <td className="code-cell">{formatCode(item.code)}</td>
                      <td className="denomination-cell">
                        ₹{Number(item.denomination ?? 0)}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {normalizeStatus(item.status)}
                        </span>
                      </td>
                      <td>{formatIssuedDateTime(item.issuedDateTime)}</td>
                      <td>{formatValidityPeriod(item.validityMonths)}</td>
                      <td>{formatDate(item.expiryDate)}</td>
                      <td>{item.campaignName || "-"}</td>
                      <td className="theme-cell">
                        {item.theme ? (
                          <img
                            src={item.theme}
                            alt={item.campaignName || "Theme"}
                            className="theme-image"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>{item.redeemedBy || "-"}</td>
                      <td className="select-cell">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelect(item.id)}
                          aria-label={`Select ${item.code}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="code-report-table-footer">
              <div className="code-report-pagination">
                <span className="pagination-info">
                  Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex}{" "}
                  of {totalEntries} entries
                </span>
                <div className="pagination-controls">
                  <select
                    className="pagination-entries"
                    value={entriesPerPage}
                    onChange={handleEntriesChange}
                  >
                    <option value="6">6</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-page">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
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

export default TruCodeReport;