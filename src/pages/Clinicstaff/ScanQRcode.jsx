import { useState } from "react";
import { QrCode, Camera, User, CheckCircle, RefreshCw } from "lucide-react";
import "../../styles/ScanQRCode.css";

function ScanQRCode() {
    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handleStartScan = () => {
        setScanning(true);
        setScanned(false);

        // Demo scanning simulation
        setTimeout(() => {
            setScanning(false);
            setScanned(true);
        }, 2000);
    };

    const handleReset = () => {
        setScanning(false);
        setScanned(false);
    };

    return (
        <div className="scan-page">
            {/* Header */}
            <div className="scan-header">
                <div>
                    <h1>Scan QR Code</h1>
                    <p>
                        Scan a patient's QR code to quickly access their
                        information.
                    </p>
                </div>

                <div className="header-icon">
                    <QrCode size={26} />
                </div>
            </div>

            {/* Scanner Card */}
            <div className="scanner-container">
                {!scanned ? (
                    <>
                        <div className="scanner-title">
                            <h2>Patient QR Scanner</h2>
                            <p>
                                Place the patient's QR code inside the frame
                            </p>
                        </div>

                        {/* Scanner */}
                        <div className={`qr-scanner ${scanning ? "scanning" : ""}`}>
                            <div className="scanner-frame">
                                <span className="corner top-left"></span>
                                <span className="corner top-right"></span>
                                <span className="corner bottom-left"></span>
                                <span className="corner bottom-right"></span>

                                {scanning && (
                                    <div className="scan-line"></div>
                                )}

                                <QrCode size={90} strokeWidth={1.2} />
                            </div>

                            {!scanning && (
                                <p className="scanner-message">
                                    <Camera size={18} />
                                    Ready to scan
                                </p>
                            )}

                            {scanning && (
                                <p className="scanner-message scanning-text">
                                    Scanning QR code...
                                </p>
                            )}
                        </div>

                        {/* Button */}
                        <button
                            className="scan-button"
                            onClick={handleStartScan}
                            disabled={scanning}
                        >
                            {scanning ? (
                                <>
                                    <RefreshCw className="spin" size={19} />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Camera size={19} />
                                    Start Scanner
                                </>
                            )}
                        </button>

                        {/* Instructions */}
                        <div className="scan-instructions">
                            <div className="instruction">
                                <span>1</span>
                                <p>Ask the patient to show their QR code.</p>
                            </div>

                            <div className="instruction">
                                <span>2</span>
                                <p>Place the QR code inside the scanner frame.</p>
                            </div>

                            <div className="instruction">
                                <span>3</span>
                                <p>Patient information will appear automatically.</p>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Scanned Result */
                    <div className="scan-result">
                        <div className="success-icon">
                            <CheckCircle size={45} />
                        </div>

                        <h2>QR Code Scanned Successfully</h2>
                        <p>Patient information has been found.</p>

                        <div className="patient-result">
                            <div className="patient-result-icon">
                                <User size={25} />
                            </div>

                            <div>
                                <span>Patient</span>
                                <h3>Juan Dela Cruz</h3>
                                <p>Patient ID: P-001</p>
                            </div>
                        </div>

                        <div className="result-actions">
                            <button className="continue-button">
                                View Patient
                            </button>

                            <button
                                className="again-button"
                                onClick={handleReset}
                            >
                                <RefreshCw size={17} />
                                Scan Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Security Notice */}
            <div className="security-notice">
                <CheckCircle size={18} />
                <div>
                    <strong>Secure Patient Access</strong>
                    <p>
                        Patient information is protected and can only be
                        accessed by authorized clinic staff.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ScanQRCode;

