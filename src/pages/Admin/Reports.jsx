import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, AlertTriangle, Download, FileText, Pill, Printer, RefreshCw, Search, Stethoscope, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { requestPatientApi } from "../../services/userManagementService";
import { displayValue, emptyFilters, filterRecords, reportCategories } from "./reportModel";
import { exportExcel, exportPdf, printReport } from "./reportExport";
import "../../styles/Reports.css";

async function loadReports() {
  const data = await requestPatientApi("/api/admin/reports");
  if (!Object.keys(reportCategories).every((key) => Array.isArray(data[key]))) {
    throw new Error("The reports service returned an invalid response.");
  }
  return data;
}

const uniqueOptions = (records, field) => [...new Set(records.map((row) => row[field]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
const sortRows = (rows, sort) => [...rows].sort((a, b) => {
  const left = a[sort.key] ?? "";
  const right = b[sort.key] ?? "";
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: "base" }) * (sort.direction === "asc" ? 1 : -1);
});

function Reports() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("patients");
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState({ key: "id", direction: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updated, setUpdated] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const requestSequence = useRef(0);
  const generating = useRef(false);

  useEffect(() => {
    let active = true;
    let inFlight = false;
    const refresh = async () => {
      if (inFlight || generating.current) return;
      inFlight = true;
      const request = ++requestSequence.current;
      try {
        const result = await loadReports();
        if (active && request === requestSequence.current) { setData(result); setUpdated(new Date().toISOString()); setError(""); }
      } catch (loadError) {
        if (active && request === requestSequence.current) { setData(null); setGenerated(null); setError(loadError.message); }
      } finally {
        inFlight = false;
        if (active) setLoading(false);
      }
    };
    refresh();
    const interval = window.setInterval(() => { if (!document.hidden) refresh(); }, 60000);
    const onVisible = () => { if (!document.hidden) refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { active = false; requestSequence.current += 1; window.clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
  }, [refreshKey]);

  const definition = reportCategories[category];
  const invalidRange = filters.start && filters.end && filters.start > filters.end;
  const filtered = useMemo(() => invalidRange || !data ? [] :
    sortRows(filterRecords(data[category], category, filters), sort), [data, category, filters, sort, invalidRange]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const admin = [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ") || user?.name || user?.email || "Not available";

  const resetGenerated = () => { setGenerated(null); setSuccess(""); };
  const changeFilter = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(1); setError("");
    resetGenerated();
  };
  const resetFilters = () => { setFilters(emptyFilters); setPage(1); setError(""); resetGenerated(); };
  const changeCategory = (value) => {
    setCategory(value); setFilters(emptyFilters); setSort({ key: "id", direction: "asc" }); setPage(1); setError(""); resetGenerated();
  };
  const changeSort = (key) => {
    setSort((previous) => ({ key, direction: previous.key === key && previous.direction === "asc" ? "desc" : "asc" }));
    setPage(1); resetGenerated();
  };

  async function generate() {
    if (invalidRange) { setError("The start date must not be after the end date."); return; }
    if (generating.current) return;
    generating.current = true;
    const request = ++requestSequence.current;
    setBusy(true); setError(""); setSuccess("");
    try {
      const latest = await loadReports();
      if (request !== requestSequence.current) return;
      const rows = sortRows(filterRecords(latest[category], category, filters), sort);
      setData(latest); setUpdated(new Date().toISOString());
      setGenerated({ category, title: definition.title, columns: definition.columns, rows, generatedAt: new Date().toISOString(), admin,
        filters: Object.entries(filters).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(" | ") || "All records" });
      setSuccess(`Report generated successfully with ${rows.length.toLocaleString()} records. Exports use this snapshot.`);
    } catch (generateError) {
      if (request === requestSequence.current) { setData(null); setGenerated(null); setError(`Report generation failed: ${generateError.message}`); }
    } finally { generating.current = false; setBusy(false); }
  }
  async function runExport(action) {
    setError("");
    try { await action(generated); } catch (exportError) { setError(`Could not export the report: ${exportError.message}`); }
  }

  const stats = data && [
    { label: "Total Students", value: data.patients.length, Icon: Users },
    { label: "Total Consultations", value: data.consultations.length, Icon: Stethoscope },
    { label: "Medicines Issued", value: data.issuances.reduce((sum, item) => sum + (Number.isSafeInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0), 0), Icon: Pill },
    { label: "Low Stock Medicines", value: data.medicines.filter((item) => item.lowStock).length, Icon: AlertTriangle },
    { label: "Clinic Transactions", value: data.transactions.length, Icon: Activity },
  ];
  const patientCategory = ["patients", "consultations", "issuances", "transactions"].includes(category);
  const hasStaff = ["consultations", "issuances", "transactions"].includes(category);
  const hasMedicine = ["medicines", "issuances"].includes(category);

  return <div className="reports-page">
    <header className="reports-header">
      <div><p className="reports-eyebrow">ADMINISTRATION</p><h1>Reports</h1><p>Monitor clinic activity and generate reports from current records.</p></div>
      <button type="button" className="reports-button" disabled={busy} onClick={() => { setLoading(true); setRefreshKey((key) => key + 1); }}><RefreshCw size={17} /> Refresh data</button>
    </header>
    {error && <div className="reports-message error" role="alert">{error}</div>}
    {success && <div className="reports-message success" role="status">{success}</div>}
    {loading && <p role="status">Loading clinic records...</p>}
    {data && <>
      <section className="report-summary" aria-label="Clinic statistics">
        {stats.map(({ label, value, Icon }) => <div className="report-summary-card" key={label}>
          <div className="report-summary-icon"><Icon size={22} /></div><div><span>{label}</span><strong>{value.toLocaleString()}</strong></div>
        </div>)}
      </section>
      <p className="reports-hint">Updated {displayValue("createdAt", updated)} Philippine time. Statistics refresh every minute while this page is visible. Issued medicines are counted by quantity; low stock includes out-of-stock items at or below their reorder level.</p>
      <section className="reports-filter-card">
        <h2>Report filters</h2>
        <form onSubmit={(event) => { event.preventDefault(); if (invalidRange) setError("The start date must not be after the end date."); else { setError(""); setPage(1); } }}>
          <fieldset disabled={busy} className="reports-fieldset"><div className="report-filters">
            <label>Report category<select value={category} onChange={(event) => changeCategory(event.target.value)}>{Object.entries(reportCategories).map(([key, item]) => <option value={key} key={key}>{item.title}</option>)}</select></label>
            {patientCategory && <label>Student name or ID<input type="search" value={filters.search} placeholder="Name, patient or student ID" onChange={(event) => changeFilter("search", event.target.value)} /></label>}
            <label>Start date<input type="date" value={filters.start} onChange={(event) => changeFilter("start", event.target.value)} /></label>
            <label>End date<input type="date" value={filters.end} onChange={(event) => changeFilter("end", event.target.value)} /></label>
            {category === "consultations" && <label>Consultation type<select value={filters.consultationType} onChange={(event) => changeFilter("consultationType", event.target.value)}><option value="">All types</option>{uniqueOptions(data.consultations, "type").map((item) => <option key={item}>{item}</option>)}</select></label>}
            {hasStaff && <label>Clinic staff<select value={filters.staff} onChange={(event) => changeFilter("staff", event.target.value)}><option value="">All staff</option>{uniqueOptions(data[category], "staff").map((item) => <option key={item}>{item}</option>)}</select></label>}
            {hasMedicine && <label>Medicine<select value={filters.medicine} onChange={(event) => changeFilter("medicine", event.target.value)}><option value="">All medicines</option>{uniqueOptions(data[category], category === "medicines" ? "name" : "medicine").map((item) => <option key={item}>{item}</option>)}</select></label>}
            {category === "transactions" && <label>Transaction type<select value={filters.transactionType} onChange={(event) => changeFilter("transactionType", event.target.value)}><option value="">All types</option>{uniqueOptions(data.transactions, "type").map((item) => <option key={item}>{item}</option>)}</select></label>}
          </div>
          <p className="reports-hint">Dates use Philippine time. {category === "medicines" ? "Inventory dates refer to when the medicine was added, not its expiry." : "Records without a date are excluded when a date range is set."}</p>
          {invalidRange && <p className="reports-range-error" role="alert">Start date must not be after end date.</p>}
          <div className="reports-actions"><button className="reports-button" type="submit"><Search size={16} /> Search</button><button className="reports-button" type="button" onClick={resetFilters}>Reset filters</button><button className="reports-button primary" type="button" disabled={busy || !!invalidRange} onClick={generate}><FileText size={16} /> {busy ? "Generating..." : "Generate report"}</button></div></fieldset>
        </form>
      </section>
      <section className="reports-card">
        <div className="reports-card-header"><div><h2>{definition.title}</h2><p>{filtered.length.toLocaleString()} matching records</p></div>
          <div className="reports-actions">
            <button type="button" className="reports-button" disabled={!generated || busy} onClick={() => runExport(exportPdf)}><Download size={16} /> PDF</button>
            <button type="button" className="reports-button" disabled={!generated || busy} onClick={() => runExport(exportExcel)}><Download size={16} /> Excel</button>
            <button type="button" className="reports-button" disabled={!generated || busy} onClick={() => runExport(printReport)}><Printer size={16} /> Print</button>
          </div>
        </div>
        <p className="reports-hint">{generated ? `Generated snapshot: ${generated.rows.length.toLocaleString()} records at ${displayValue("createdAt", generated.generatedAt)} Philippine time.` : "Generate a report to enable downloads and printing."}</p>
        {category === "transactions" && <p className="reports-hint">Activity is derived from patient registrations, consultations, and medicine issuances. These are events, not a separate transaction ledger; an issuance during a consultation is a separate event.</p>}
        <div className="reports-table-wrapper"><table className="reports-table">
          <thead><tr>{definition.columns.map(([key, label]) => <th key={key} aria-sort={sort.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}><button type="button" disabled={busy} onClick={() => changeSort(key)}>{label}{sort.key === key ? (sort.direction === "asc" ? " ↑" : " ↓") : ""}</button></th>)}</tr></thead>
          <tbody>{pageRows.length ? pageRows.map((row) => <tr key={row.id}>{definition.columns.map(([key]) => <td key={key}>{displayValue(key, row[key])}</td>)}</tr>) :
            <tr><td colSpan={definition.columns.length} className="reports-empty">No records match the selected filters. <button type="button" onClick={resetFilters}>Clear filters</button></td></tr>}</tbody>
        </table></div>
        <div className="reports-table-footer"><label>Records per page <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option>10</option><option>25</option><option>50</option><option>100</option></select></label>
          <span>{filtered.length ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}` : "0 records"}</span>
          <div className="reports-actions"><button className="reports-button" type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pages}</span><button className="reports-button" type="button" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>
        </div>
      </section>
    </>}
    {!data && !loading && <button className="reports-button" type="button" onClick={() => { setLoading(true); setRefreshKey((key) => key + 1); }}>Retry</button>}
  </div>;
}

export default Reports;
