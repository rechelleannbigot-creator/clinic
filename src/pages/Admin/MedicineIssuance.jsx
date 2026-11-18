import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { AlertTriangle, CalendarDays, ClipboardList, Eye, Pill, QrCode, Users, X } from "lucide-react";
import { getPatients } from "../../services/userManagementService";
import { getIssuances, getMedicines, saveIssuance } from "../../services/clinicService";
import "../../styles/MedicineIssuance.css";

const blankForm = { medicineId: "", quantity: "", dosage: "", instructions: "", reason: "" };
const nameOf = (patient) => [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ");
const studentIdOf = (patient) => String(patient.studentId || patient.studentNumber || "");
const localDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
};
const displayDate = (value) => value && !Number.isNaN(new Date(value).getTime())
  ? new Date(value).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" })
  : "Not available";

function qrId(value) {
  const input = value.trim();
  try {
    const parsed = JSON.parse(input);
    if (typeof parsed === "string") return parsed.trim();
    if (parsed && typeof parsed === "object") return String(parsed.patientId ?? parsed.studentId ?? parsed.id ?? "").trim();
    return "";
  } catch {
    return input;
  }
}

function MedicineIssuance() {
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [scanning, setScanning] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState(null);
  const [details, setDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [patientFilter, setPatientFilter] = useState("");
  const [order, setOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const savingRef = useRef(false);

  async function load() {
    const [studentList, stock, history] = await Promise.all([getPatients(), getMedicines(), getIssuances()]);
    setPatients(studentList);
    setMedicines(stock);
    setRecords(history);
  }

  useEffect(() => {
    let active = true;
    Promise.all([getPatients(), getMedicines(), getIssuances()])
      .then(([studentList, stock, history]) => {
        if (active) { setPatients(studentList); setMedicines(stock); setRecords(history); }
      })
      .catch((loadError) => { if (active) { setError(loadError.message); setLoadFailed(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!pending) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [pending]);

  useEffect(() => {
    if (!scanning) return undefined;
    const scanner = new Html5Qrcode("issuance-qr-reader");
    let cancelled = false;
    let handled = false;
    const start = async () => {
      try {
        await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 230, height: 230 } }, (value) => {
          if (cancelled || handled) return;
          handled = true;
          const id = qrId(value).toLowerCase();
          const matches = id ? patients.filter((item) => item.id.toLowerCase() === id || studentIdOf(item).toLowerCase() === id) : [];
          if (matches.length === 1) {
            setPatient(matches[0]);
            setPatientSearch(nameOf(matches[0]));
            setError("");
          } else setError(matches.length ? "This QR code matches multiple students. Search by patient ID instead." : "No registered student matches this QR code.");
          setScanning(false);
        }, () => {});
        if (cancelled && scanner.isScanning) { await scanner.stop(); scanner.clear(); }
      } catch (scanError) {
        console.error("QR scanner error:", scanError);
        if (!cancelled) { setError("Unable to open the camera. Allow camera access and use HTTPS or localhost."); setScanning(false); }
      }
    };
    start();
    return () => {
      cancelled = true;
      if (scanner.isScanning) scanner.stop().then(() => scanner.clear()).catch((stopError) => console.error("Unable to stop QR scanner:", stopError));
    };
  }, [scanning, patients]);

  const matches = useMemo(() => {
    const term = patientSearch.trim().toLowerCase();
    if (!term || patient) return [];
    return patients.filter((item) => [nameOf(item), item.id, studentIdOf(item)].some((value) => value.toLowerCase().includes(term))).slice(0, 10);
  }, [patientSearch, patient, patients]);
  const medicine = medicines.find((item) => item.id === form.medicineId);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((item) => {
      return (!term || [item.patientName, item.patientId, item.studentId].some((value) => String(value || "").toLowerCase().includes(term))) &&
        (!patientFilter || item.patientId === patientFilter) &&
        (!medicineFilter || item.medicineId === medicineFilter) &&
        (!dateFilter || localDate(item.createdAt) === dateFilter);
    }).sort((a, b) => order === "newest" ? (b.createdAt || "").localeCompare(a.createdAt || "") : (a.createdAt || "").localeCompare(b.createdAt || ""));
  }, [records, search, medicineFilter, dateFilter, patientFilter, order]);
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const totalQuantity = records.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const todayQuantity = records.filter((item) => localDate(item.createdAt) === localDate(new Date())).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  function prepare(event) {
    event.preventDefault();
    const quantity = Number(form.quantity);
    if (!patient || !medicine || !Number.isSafeInteger(quantity) || quantity < 1 ||
        !form.dosage.trim() || !form.instructions.trim() || !form.reason.trim()) {
      setError("Select a student and medicine, and complete all fields with a positive whole-number quantity.");
      return;
    }
    if (!Number.isSafeInteger(medicine.quantity) || quantity > medicine.quantity) {
      setError("The quantity exceeds available stock. Refresh inventory and try again.");
      return;
    }
    setError("");
    setConfirming(true);
  }

  async function submit() {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    const request = pending || { requestId: crypto.randomUUID(), patientId: patient.id, ...form, quantity: Number(form.quantity) };
    setPending(request);
    setError("");
    try {
      const saved = await saveIssuance(request);
      setPending(null);
      setConfirming(false);
      setForm(blankForm);
      setPatient(null);
      setPatientSearch("");
      setSuccess(`Medicine issued successfully. Reference: ${saved.issuanceId}`);
      try { await load(); } catch (loadError) { setError(`Issuance saved, but data could not be refreshed: ${loadError.message}`); }
    } catch (saveError) {
      if (!pending && [400, 401, 403, 404, 409].includes(saveError.status)) {
        setPending(null);
        setConfirming(false);
      }
      setError(!pending && saveError.status && saveError.status < 500
        ? saveError.message
        : `${saveError.message} The result is uncertain; retry this same request before leaving this page.`);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  const stats = [
    { label: "Total medicines issued", value: totalQuantity, Icon: Pill },
    { label: "Patients served", value: new Set(records.map((item) => item.patientId).filter(Boolean)).size, Icon: Users },
    { label: "Issuance transactions", value: records.length, Icon: ClipboardList },
    { label: "Medicines issued today", value: todayQuantity, Icon: CalendarDays },
  ];

  return <div className="issuance-page">
    <header className="mi-header"><div><p className="mi-eyebrow">CLINIC SERVICES</p><h1>Medicine Issuance</h1><p>Issue available medicine and review dispensing history.</p></div><button type="button" className="mi-secondary" disabled={loading || saving || !!pending} onClick={async () => {
      setLoading(true);
      setError("");
      try { await load(); setLoadFailed(false); } catch (loadError) { setError(loadError.message); setLoadFailed(true); }
      finally { setLoading(false); }
    }}>Refresh data</button></header>
    {error && <div className="mi-message mi-error" role="alert">{error}</div>}
    {success && <div className="mi-message mi-success" role="status">{success}</div>}
    {loading ? <p role="status">Loading medicine issuance...</p> : loadFailed ? <button className="mi-secondary" type="button" onClick={async () => {
      setLoading(true);
      setError("");
      try { await load(); setLoadFailed(false); } catch (loadError) { setError(loadError.message); }
      finally { setLoading(false); }
    }}>Retry loading</button> : <>
      <div className="mi-stats">{stats.map(({ label, value, Icon }) => <div className="mi-stat" key={label}><span><Icon size={22} /></span><div><p>{label}</p><strong>{value}</strong></div></div>)}</div>
      <section className="mi-card">
        <div className="mi-section-heading"><div><h2>Issue medicine</h2><p>Select a registered student and medicine from the inventory.</p></div></div>
        <form onSubmit={prepare}>
          <fieldset disabled={saving || !!pending} className="mi-fieldset">
            <div className="mi-grid">
              <div className="mi-field mi-wide">
                <label htmlFor="mi-patient-search">Search student by name, student ID or patient ID</label>
                <div className="mi-search-row"><input id="mi-patient-search" value={patientSearch} autoComplete="off" onChange={(event) => { setPatientSearch(event.target.value); setPatient(null); }} placeholder="Search registered students" /><button type="button" className="mi-secondary" onClick={() => setScanning((value) => !value)}><QrCode size={17} /> {scanning ? "Stop scan" : "Scan QR"}</button></div>
                {patientSearch.trim() && !patient && <div className="mi-results">{matches.length ? matches.map((item) => <button type="button" key={item.id} onClick={() => { setPatient(item); setPatientSearch(nameOf(item)); }}>{nameOf(item)} · {studentIdOf(item) || "Student ID not provided"} · {item.id}</button>) : <p>No matching students.</p>}</div>}
                {scanning && <div className="mi-scanner"><div id="issuance-qr-reader" /><p>Position the patient's QR code in the camera frame.</p></div>}
                {patient && <div className="mi-patient"><strong>{nameOf(patient)}</strong><span>Student ID: {studentIdOf(patient) || "Not provided"} · Patient ID: {patient.id}</span><span>{patient.course || patient.section || "Course / section not provided"} · {patient.yearLevel || "Year level not provided"}</span><button type="button" className="mi-link" onClick={() => { setPatientFilter(patient.id); setPage(1); }}>View this student's history</button></div>}
              </div>
              <div className="mi-field"><label htmlFor="mi-medicine">Medicine</label><select required id="mi-medicine" value={form.medicineId} onChange={(event) => setForm({ ...form, medicineId: event.target.value })}><option value="">Select medicine</option>{medicines.map((item) => {
                const expiry = item.expirationDate || item.expiry || "";
                const unavailable = !Number.isSafeInteger(item.quantity) || item.quantity <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(expiry) || expiry < localDate(new Date());
                return <option key={item.id} value={item.id} disabled={unavailable}>{item.name} ({item.quantity} {item.unit}){unavailable ? " - unavailable" : ""}</option>;
              })}</select>{medicine && <p className={medicine.quantity <= (medicine.reorderLevel ?? 30) ? "mi-warning" : "mi-hint"}>{medicine.quantity <= (medicine.reorderLevel ?? 30) && <AlertTriangle size={15} />} Available: {medicine.quantity} {medicine.unit} · Expiry: {medicine.expirationDate || medicine.expiry || "Not set"}</p>}</div>
              <div className="mi-field"><label htmlFor="mi-quantity">Quantity</label><input id="mi-quantity" type="number" min="1" step="1" max={medicine?.quantity} required value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></div>
              <div className="mi-field"><label htmlFor="mi-dosage">Dosage</label><input id="mi-dosage" required maxLength={5000} value={form.dosage} onChange={(event) => setForm({ ...form, dosage: event.target.value })} placeholder="e.g. One tablet" /></div>
              <div className="mi-field"><label htmlFor="mi-reason">Reason for issuance</label><input id="mi-reason" required maxLength={5000} value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} /></div>
              <div className="mi-field mi-wide"><label htmlFor="mi-instructions">Instructions</label><textarea id="mi-instructions" required maxLength={5000} value={form.instructions} onChange={(event) => setForm({ ...form, instructions: event.target.value })} /></div>
            </div>
            <div className="mi-actions"><button className="mi-primary" type="submit" disabled={!patients.length || !medicines.length}>Review issuance</button></div>
          </fieldset>
        </form>
      </section>
      <section className="mi-card">
        <div className="mi-section-heading"><div><h2>Issuance history</h2><p>Includes medicines issued during consultations.</p></div></div>
        {patientFilter && <div className="mi-filter-note">Showing history for {records.find((item) => item.patientId === patientFilter)?.patientName || patientFilter}. <button type="button" className="mi-link" onClick={() => { setPatientFilter(""); setPage(1); }}>Show all</button></div>}
        <div className="mi-filters">
          <input aria-label="Search issuance history" placeholder="Search student name or ID" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          <select aria-label="Filter by medicine" value={medicineFilter} onChange={(event) => { setMedicineFilter(event.target.value); setPage(1); }}><option value="">All medicines</option>{[...new Map(records.filter((item) => item.medicineId).map((item) => [item.medicineId, item.medicineName])).entries()].map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select>
          <input aria-label="Filter by date" type="date" value={dateFilter} onChange={(event) => { setDateFilter(event.target.value); setPage(1); }} />
          <select aria-label="Sort issuance history" value={order} onChange={(event) => { setOrder(event.target.value); setPage(1); }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>
        </div>
        <div className="mi-table-wrap"><table><thead><tr>{["Issuance ID", "Student ID", "Student name", "Medicine", "Quantity", "Dosage", "Instructions", "Issuance date", "Issued by", "Action"].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{filtered.slice((currentPage - 1) * 10, currentPage * 10).map((item) => <tr key={item.issuanceId}><td>{item.issuanceId}</td><td>{item.studentId || "Not provided"}</td><td>{item.patientName}</td><td>{item.medicineName}</td><td>{item.quantity} {item.unit}</td><td>{item.dosage}</td><td>{item.instructions}</td><td>{displayDate(item.createdAt)}</td><td>{item.issuedBy}</td><td><button type="button" className="mi-link" onClick={() => setDetails(item)}><Eye size={16} /> View</button></td></tr>)}</tbody></table></div>
        {!filtered.length && <p className="mi-empty">No issuance records found.</p>}
        {pages > 1 && <div className="mi-pagination"><button type="button" className="mi-secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</button><span>Page {currentPage} of {pages}</span><button type="button" className="mi-secondary" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Next</button></div>}
      </section>
    </>}
    {confirming && <div className="mi-overlay"><div className="mi-modal" role="dialog" aria-modal="true" aria-labelledby="mi-confirm-title"><h2 id="mi-confirm-title">Confirm issuance</h2><p>Issue {form.quantity} {medicine?.unit} of {medicine?.name} to {patient && nameOf(patient)}? Stock will be deducted when saved.</p>{pending && <p className="mi-warning">The previous result is uncertain. Retry the same request to safely confirm it.</p>}{error && <p className="mi-error mi-message" role="alert">{error}</p>}<div className="mi-actions"><button type="button" className="mi-secondary" disabled={saving || !!pending} onClick={() => setConfirming(false)}>Cancel</button><button type="button" className="mi-primary" disabled={saving} onClick={submit}>{saving ? "Saving..." : pending ? "Retry request" : "Confirm issuance"}</button></div></div></div>}
    {details && <div className="mi-overlay"><div className="mi-modal" role="dialog" aria-modal="true" aria-labelledby="mi-details-title"><div className="mi-modal-heading"><h2 id="mi-details-title">Issuance details</h2><button className="mi-icon-button" type="button" aria-label="Close details" onClick={() => setDetails(null)}><X size={20} /></button></div><dl className="mi-details">{[["Reference", details.issuanceId], ["Student", details.patientName], ["Student ID", details.studentId || "Not provided"], ["Patient ID", details.patientId], ["Course / section", details.course], ["Year level", details.yearLevel], ["Medicine", details.medicineName], ["Quantity", `${details.quantity} ${details.unit || ""}`], ["Dosage", details.dosage], ["Instructions", details.instructions], ["Reason", details.reason], ["Date and time", displayDate(details.createdAt)], ["Issued by", details.issuedBy]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not available"}</dd></div>)}</dl><button type="button" className="mi-secondary" onClick={() => { setPatientFilter(details.patientId); setPage(1); setDetails(null); }}>View student's history</button></div></div>}
  </div>;
}

export default MedicineIssuance;
