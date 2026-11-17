import { useState } from "react";
import {
  X,
  Copy,
  CheckCircle,
  Mail,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import "../../styles/StudentCredentialsPopup.css";

function StudentCredentialsPopup({ student, onClose }) {
  const [copiedField, setCopiedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(student.temporaryPassword);
    setCopiedField("password");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(student.email);
    setCopiedField("email");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAllCredentials = () => {
    const credentials = `Email: ${student.email}\nTemporary Password: ${student.temporaryPassword}`;
    navigator.clipboard.writeText(credentials);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fullName = [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="credentials-modal-overlay">
      <div
        className="credentials-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="credentials-modal-title"
      >
        {/* Header */}
        <div className="credentials-modal-header">
          <div className="credentials-modal-header-content">
            <div className="credentials-modal-icon">
              <CheckCircle size={28} />
            </div>
            <div>
              <h2 id="credentials-modal-title">Student Account Created</h2>
              <p>Share these credentials with the student</p>
            </div>
          </div>
          <button
            type="button"
            className="credentials-modal-close"
            onClick={onClose}
            aria-label="Close credentials popup"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="credentials-modal-body">
          {/* Student Name */}
          <div className="credentials-section">
            <div className="credentials-label">
              <User size={16} />
              Student Name
            </div>
            <div className="credentials-value-display">
              <span>{fullName}</span>
            </div>
          </div>

          {/* Email */}
          <div className="credentials-section">
            <div className="credentials-label">
              <Mail size={16} />
              Email Address (Username)
            </div>
            <div className="credentials-value">
              <input
                type="text"
                readOnly
                value={student.email}
                className="credentials-input"
              />
              <button
                type="button"
                className={`credentials-copy-btn ${
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

          {/* Temporary Password */}
          <div className="credentials-section">
            <div className="credentials-label">
              <Lock size={16} />
              Temporary Password
            </div>
            <div className="credentials-value">
              <input
                type={showPassword ? "text" : "password"}
                readOnly
                value={student.temporaryPassword}
                className="credentials-input"
              />
              <button
                type="button"
                className="credentials-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <button
                type="button"
                className={`credentials-copy-btn ${
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
          <div className="credentials-notice">
            <AlertCircle size={18} />
            <div>
              <strong>Important:</strong> The student must change this temporary
              password after their first login for security purposes. They can use
              the password reset link sent to their email.
            </div>
          </div>

          {/* Instructions */}
          <div className="credentials-instructions">
            <h3>Next Steps:</h3>
            <ol>
              <li>
                Personally provide these credentials to the student or show them
                this screen
              </li>
              <li>
                Direct the student to visit the clinic login page at{" "}
                <strong>
                  {(window.location.origin || "your clinic system")}
                </strong>
              </li>
              <li>
                Student logs in using the email address and temporary password
              </li>
              <li>
                Student is prompted to create a new password immediately after
                first login
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="credentials-modal-footer">
          <button
            type="button"
            className={`credentials-copy-all-btn ${
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
            className="credentials-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentCredentialsPopup;
