import { useState } from "react";
import {
  X,
  Copy,
  CheckCircle,
  Mail,
  Lock,
  User,
  AlertCircle,
  Printer,
} from "lucide-react";
import "../../styles/StaffCredentialsPopup.css";

function StaffCredentialsPopup({ staff, onClose }) {
  const [copiedField, setCopiedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(staff.temporaryPassword);
    setCopiedField("password");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(staff.email);
    setCopiedField("email");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAllCredentials = () => {
    const credentials = `Staff ID: ${staff.staffId}\nName: ${[staff.firstName, staff.middleName, staff.lastName].filter(Boolean).join(" ")}\nEmail: ${staff.email}\nTemporary Password: ${staff.temporaryPassword}`;
    navigator.clipboard.writeText(credentials);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=400,width=600");
    const fullName = [staff.firstName, staff.middleName, staff.lastName]
      .filter(Boolean)
      .join(" ");
    printWindow.document.write(`
      <html>
        <head>
          <title>Staff Credentials</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1677c8; padding-bottom: 15px; }
            .print-header h2 { margin: 0; color: #173b63; }
            .print-section { margin: 20px 0; }
            .print-label { font-weight: bold; color: #173b63; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
            .print-value { background: #f5f7fb; padding: 10px; border-radius: 4px; font-family: monospace; }
            .print-notice { background: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin-top: 20px; font-size: 12px; }
            .print-footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Staff Account Created</h2>
            <p>Clinic Management System</p>
          </div>
          
          <div class="print-section">
            <div class="print-label">Staff ID</div>
            <div class="print-value">${staff.staffId}</div>
          </div>
          
          <div class="print-section">
            <div class="print-label">Full Name</div>
            <div class="print-value">${fullName}</div>
          </div>
          
          <div class="print-section">
            <div class="print-label">Email Address (Username)</div>
            <div class="print-value">${staff.email}</div>
          </div>
          
          <div class="print-section">
            <div class="print-label">Role</div>
            <div class="print-value">Clinic Staff</div>
          </div>
          
          <div class="print-section">
            <div class="print-label">Temporary Password</div>
            <div class="print-value">${staff.temporaryPassword}</div>
          </div>
          
          <div class="print-notice">
            <strong>Important:</strong> The staff member must change this temporary password after their first login for security purposes. They can use the password reset link on the login page or the "Forgot Password" option.
          </div>
          
          <div class="print-footer">
            <p>This document should be securely delivered to the staff member. Keep this confidential and do not share with unauthorized personnel.</p>
            <p>Printed on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const fullName = [staff.firstName, staff.middleName, staff.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="staff-credentials-modal-overlay">
      <div
        className="staff-credentials-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-credentials-modal-title"
      >
        {/* Header */}
        <div className="staff-credentials-modal-header">
          <div className="staff-credentials-modal-header-content">
            <div className="staff-credentials-modal-icon">
              <CheckCircle size={28} />
            </div>
            <div>
              <h2 id="staff-credentials-modal-title">Staff Account Created</h2>
              <p>Share these credentials with the staff member</p>
            </div>
          </div>
          <button
            type="button"
            className="staff-credentials-modal-close"
            onClick={onClose}
            aria-label="Close credentials popup"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="staff-credentials-modal-body">
          {/* Staff ID */}
          <div className="staff-credentials-section">
            <div className="staff-credentials-label">Staff ID</div>
            <div className="staff-credentials-value-display">
              <span>{staff.staffId}</span>
            </div>
          </div>

          {/* Staff Name */}
          <div className="staff-credentials-section">
            <div className="staff-credentials-label">
              <User size={16} />
              Full Name
            </div>
            <div className="staff-credentials-value-display">
              <span>{fullName}</span>
            </div>
          </div>

          {/* Email */}
          <div className="staff-credentials-section">
            <div className="staff-credentials-label">
              <Mail size={16} />
              Email Address (Username)
            </div>
            <div className="staff-credentials-value">
              <input
                type="text"
                readOnly
                value={staff.email}
                className="staff-credentials-input"
              />
              <button
                type="button"
                className={`staff-credentials-copy-btn ${
                  copiedField === "email" ? "copied" : ""
                }`}
                onClick={handleCopyEmail}
                title="Copy email address"
                aria-label="Copy email address"
              >
                {copiedField === "email" ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div className="staff-credentials-section">
            <div className="staff-credentials-label">Assigned Role</div>
            <div className="staff-credentials-value-display">
              <span>Clinic Staff</span>
            </div>
          </div>

          {/* Temporary Password */}
          <div className="staff-credentials-section">
            <div className="staff-credentials-label">
              <Lock size={16} />
              Temporary Password
            </div>
            <div className="staff-credentials-value">
              <input
                type={showPassword ? "text" : "password"}
                readOnly
                value={staff.temporaryPassword}
                className="staff-credentials-input"
              />
              <button
                type="button"
                className="staff-credentials-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                className={`staff-credentials-copy-btn ${
                  copiedField === "password" ? "copied" : ""
                }`}
                onClick={handleCopyPassword}
                title="Copy temporary password"
                aria-label="Copy temporary password"
              >
                {copiedField === "password" ? (
                  <>
                    <CheckCircle size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="staff-credentials-notice">
            <AlertCircle size={18} />
            <div>
              <strong>Important:</strong> The staff member must change this temporary
              password after their first login for security purposes. They can use
              the password reset link on the login page or the "Forgot Password" option.
            </div>
          </div>

          {/* Instructions */}
          <div className="staff-credentials-instructions">
            <h3>Next Steps:</h3>
            <ol>
              <li>
                Personally provide these credentials to the staff member or show them
                this screen
              </li>
              <li>
                Direct the staff member to visit the clinic login page at{" "}
                <strong>
                  {(window.location.origin || "your clinic system")}
                </strong>
              </li>
              <li>
                Staff member logs in using the email address and temporary password
              </li>
              <li>
                Staff member is prompted to create a new password immediately after
                first login
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="staff-credentials-modal-footer">
          <button
            type="button"
            className={`staff-credentials-copy-all-btn ${
              copiedField === "all" ? "copied" : ""
            }`}
            onClick={handleCopyAllCredentials}
          >
            {copiedField === "all" ? (
              <>
                <CheckCircle size={18} />
                Credentials Copied!
              </>
            ) : (
              <>
                <Copy size={18} />
                Copy All Credentials
              </>
            )}
          </button>
          <button
            type="button"
            className="staff-credentials-print-btn"
            onClick={handlePrint}
            title="Print credentials"
            aria-label="Print credentials"
          >
            <Printer size={18} />
            Print Credentials
          </button>
          <button
            type="button"
            className="staff-credentials-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffCredentialsPopup;
