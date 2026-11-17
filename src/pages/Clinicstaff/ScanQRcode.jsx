import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, QrCode } from "lucide-react";
import { getDashboardPatient } from "../../services/clinicService";
import "../../styles/Staffdashboard.css";

function patientIdFromQr(value) {
    const text = value.trim();
    try {
        const parsed = JSON.parse(text);
        if (typeof parsed === "string") return parsed.trim();
        if (parsed && typeof parsed === "object") return String(parsed.patientId ?? parsed.studentId ?? parsed.id ?? "").trim();
    } catch {
        return text;
    }
    return "";
}

function ScanQRCode() {
    const [scanning, setScanning] = useState(false);
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState("");
    const [lookingUp, setLookingUp] = useState(false);

    useEffect(() => {
        if (!scanning) return undefined;
        const scanner = new Html5Qrcode("staff-dashboard-qr-reader");
        let cancelled = false;
        let handled = false;
        const start = async () => {
            try {
                await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 230, height: 230 } }, async (value) => {
                    if (cancelled || handled) return;
                    handled = true;
                    setLookingUp(true);
                    try {
                        const result = await getDashboardPatient(patientIdFromQr(value));
                        if (!cancelled) setPatient(result);
                    } catch (lookupError) {
                        if (!cancelled) setError(lookupError.message);
                    } finally {
                        if (!cancelled) {
                            setLookingUp(false);
                            setScanning(false);
                        }
                    }
                }, () => {});
                if (cancelled && scanner.isScanning) {
                    await scanner.stop();
                    scanner.clear();
                }
            } catch (scanError) {
                console.error("QR scanner error:", scanError);
                if (!cancelled) {
                    setError("Unable to open the camera. Allow camera access and use a secure connection, then try again.");
                    setScanning(false);
                }
            }
        };
        start();
        return () => {
            cancelled = true;
            if (scanner.isScanning) {
                scanner.stop().then(() => scanner.clear()).catch((stopError) => console.error("Unable to stop QR scanner:", stopError));
            }
        };
    }, [scanning]);

    return (
        <div className="staff-dashboard">
            <header className="sd-heading"><div><p className="sd-eyebrow">PATIENT ACCESS</p><h1>Scan patient QR code</h1><p>Identify a registered patient using their clinic QR code.</p></div></header>
            <section className="sd-panel sd-scanner">
                <QrCode size={32} />
                <h2>Patient QR scanner</h2>
                <p>Ask the patient to show their QR code. Camera access requires HTTPS or localhost.</p>
                {error && <p className="sd-error" role="alert">{error}</p>}
                {scanning && <><div id="staff-dashboard-qr-reader" /><p role="status">{lookingUp ? "Finding patient..." : "Position the QR code in the camera frame."}</p><button type="button" className="sd-secondary" onClick={() => { setLookingUp(false); setScanning(false); }}>Cancel</button></>}
                {!scanning && <button type="button" className="sd-primary" onClick={() => { setPatient(null); setError(""); setScanning(true); }}><Camera size={18} /> {patient ? "Scan another" : "Start scanner"}</button>}
                {patient && <div className="sd-result">
                    <h3>{patient.name || "Unnamed patient"}</h3>
                    <p>Patient ID: {patient.id}</p>
                    <p>Student ID: {patient.studentId || "Not provided"}</p>
                    <p>Course / section: {patient.course || "Not provided"} · Year level: {patient.yearLevel || "Not provided"}</p>
                    <Link className="sd-primary" to={`/staff/student-medical-profile?patientId=${encodeURIComponent(patient.id)}`}>View medical records</Link>
                </div>}
            </section>
        </div>
    );
}

export default ScanQRCode;
