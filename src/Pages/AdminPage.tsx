// src/Pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const AdminPage: React.FC = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  // Add state for last visitor details
  const [lastVisitorDetails, setLastVisitorDetails] = useState<{
    phone: string;
    villaNumber: string;
  } | null>(null);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    await signOut(auth);
    navigate("/login");
  };

  // Visitor form state
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [villaNumber, setVillaNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [passkey, setPasskey] = useState("");

  // Form errors
  const [errors, setErrors] = useState({
    visitorName: "",
    phone: "",
    villaNumber: "",
    purpose: "",
  });

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email || "");
    }
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {
      visitorName: visitorName.trim() ? "" : "Name is required",
      phone: phone.trim() ? "" : "Phone is required",
      villaNumber: villaNumber.trim() ? "" : "Villa number is required",
      purpose: purpose.trim() ? "" : "Purpose is required",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Generate random passkey
  const generatePasskey = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle visitor submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPasskey = generatePasskey();
    try {
      await addDoc(collection(db, "visitors"), {
        visitorName: visitorName.trim(),
        phone: phone.trim(),
        vehicle: vehicle.trim(),
        villaNumber: villaNumber.trim(),
        purpose: purpose.trim(),
        passkey: newPasskey,
        requestedAt: serverTimestamp(),
        status: "requested",
      });

      setPasskey(newPasskey);
      // Store visitor details for messaging
      setLastVisitorDetails({
        phone: phone.trim(),
        villaNumber: villaNumber.trim(),
      });
      showToast("Visitor registered successfully!", "success");

      // Reset form
      setVisitorName("");
      setPhone("");
      setVehicle("");
      setVillaNumber("");
      setPurpose("");
    } catch (error) {
      console.error("Error adding visitor:", error);
      showToast("Failed to register visitor. Please try again.", "error");
    }
  };

  // Send passkey via WhatsApp - works on both mobile and desktop
  const sendViaWhatsApp = () => {
    if (!passkey) {
      showToast("No passkey generated yet", "error");
      return;
    }

    const message = `Your passkey for visiting Villa ${
      lastVisitorDetails?.villaNumber || "N/A"
    } is: ${passkey}. Please present this passkey at the gate.`;
    const encodedMessage = encodeURIComponent(message);

    // URL that works for both mobile app and web
    const url = `https://wa.me/?text=${encodedMessage}`;

    // Open in new tab for better user experience
    window.open(url, "_blank");
  };

  // Send passkey via SMS - works on mobile and falls back to clipboard on desktop
  const sendViaSMS = () => {
    if (!passkey) {
      showToast("No passkey generated yet", "error");
      return;
    }

    const message = `Your passkey for visiting CD Bougainvillea, Villa No. ${
      lastVisitorDetails?.villaNumber || "N/A"
    } is: ${passkey}. Please present this passkey at the gate to the security guard.`;

    // Check if device supports SMS
    if ("sms" in navigator) {
      // Mobile device with SMS support
      (navigator as any).sms
        .send({
          body: message,
        })
        .catch((error: any) => {
          console.error("Error sending SMS:", error);
          showToast("Failed to send SMS. Please try again.", "error");
        });
    } else {
      // Desktop device - copy to clipboard
      navigator.clipboard
        .writeText(message)
        .then(() => {
          showToast("SMS message copied to clipboard", "success");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          showToast("Failed to copy to clipboard", "error");
        });
    }
  };

  return (
    <div style={containerStyle}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            ...toastStyle,
            backgroundColor: toast.type === "success" ? "#4CAF50" : "#f44336",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Top Navigation Bar */}
      <header style={headerStyle}>
        <div style={userSectionStyle}>
          <div style={userInfoStyle}>
            <i className="fas fa-user-circle" style={userIconStyle} />
            <span style={emailStyle}>{userEmail}</span>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </div>
      </header>

      <main style={mainStyle}>
        <div style={contentContainer}>
          <h1 style={sectionTitle}>
            <i className="fas fa-user-plus" style={{ marginRight: "12px" }} />
            Visitor Management
          </h1>

          <div style={dualColumnStyle}>
            {/* Registration Form */}
            <div style={formContainer}>
              <h3 style={formTitle}>
                <i className="fas fa-edit" style={{ marginRight: "10px" }} />
                New Visitor Registration
              </h3>
              <form onSubmit={handleSubmit} style={formStyle}>
                <div style={inputGroup}>
                  <label style={labelStyle}>Visitor Name*</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.visitorName ? "#f44336" : "#ddd",
                    }}
                  />
                  {errors.visitorName && (
                    <div style={errorStyle}>{errors.visitorName}</div>
                  )}
                </div>

                <div style={inputGroup}>
                  <label style={labelStyle}>Phone Number*</label>
                  <input
                    type="tel"
                    placeholder="Contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? "#f44336" : "#ddd",
                    }}
                  />
                  {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                </div>

                <div style={inputGroup}>
                  <label style={labelStyle}>Villa Number*</label>
                  <input
                    type="text"
                    placeholder="Villa number"
                    value={villaNumber}
                    onChange={(e) => setVillaNumber(e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: errors.villaNumber ? "#f44336" : "#ddd",
                    }}
                  />
                  {errors.villaNumber && (
                    <div style={errorStyle}>{errors.villaNumber}</div>
                  )}
                </div>

                <div style={inputGroup}>
                  <label style={labelStyle}>Vehicle Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="Vehicle registration"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div style={inputGroup}>
                  <label style={labelStyle}>Purpose of Visit*</label>
                  <textarea
                    placeholder="Reason for visit"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    style={{
                      ...inputStyle,
                      borderColor: errors.purpose ? "#f44336" : "#ddd",
                    }}
                  />
                  {errors.purpose && (
                    <div style={errorStyle}>{errors.purpose}</div>
                  )}
                </div>

                <button type="submit" style={submitStyle}>
                  <i
                    className="fas fa-check-circle"
                    style={{ marginRight: "8px" }}
                  />
                  Register Visitor
                </button>
              </form>
            </div>

            {/* Passkey Section */}
            <div style={passkeyContainer}>
              <div style={formContainer}>
                <div style={passkeyContent}>
                  <h3 style={{ ...formTitle, justifyContent: "center" }}>
                    <i className="fas fa-key" style={{ marginRight: "10px" }} />
                    Visitor Passkey
                  </h3>

                  {passkey ? (
                    <>
                      <div style={passkeyDisplay}>{passkey}</div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={sendViaWhatsApp}
                          style={whatsappButtonStyle}
                        >
                          <i className="fab fa-whatsapp" /> Send via WhatsApp
                        </button>
                        <button onClick={sendViaSMS} style={smsButtonStyle}>
                          <i className="fas fa-sms" /> Send via SMS
                        </button>
                      </div>
                      <p style={{ marginTop: "0.5rem", color: "#555" }}>
                        ⚠️ Please <strong>take a screenshot</strong> or{" "}
                        <strong>write down this code</strong>. It will be
                        required at the gate and cannot be retrieved later.
                      </p>
                    </>
                  ) : (
                    <div style={emptyPasskey}>
                      <i
                        className="fas fa-user-clock"
                        style={{
                          fontSize: "3rem",
                          color: "#e0e0e0",
                          marginBottom: "20px",
                        }}
                      />
                      <p>No visitor registered yet</p>
                      <p style={{ color: "#777", marginTop: "10px" }}>
                        Submit the form to generate a passkey
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global styles for icons */}
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .dual-column {
            flex-direction: column;
          }
          
          .passkey-container {
            margin-top: 20px;
          }
        }
      `}</style>
    </div>
  );
};

// ---------- Styles ----------
const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#f8f9fa",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  backgroundColor: "#ffffffff",
  color: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const userSectionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

const userInfoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const userIconStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#000000ff",
};

const emailStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#2b2b2bff",
};

const logoutButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #ff2d2dff",
  color: "#ff2d2dff",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s ease",
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: "24px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  boxSizing: "border-box",
};

const contentContainer: React.CSSProperties = {
  width: "100%",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.6rem",
  marginBottom: "28px",
  color: "#333",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
};

const dualColumnStyle: React.CSSProperties = {
  display: "flex",
  gap: "24px",
  flexWrap: "wrap",
};

const formContainer: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  flex: 1,
  minWidth: "300px",
};

const formTitle: React.CSSProperties = {
  fontSize: "1.2rem",
  marginBottom: "20px",
  color: "#444",
  display: "flex",
  alignItems: "center",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: 500,
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  backgroundColor: "#fff",
  transition: "border 0.2s ease",
};

const errorStyle: React.CSSProperties = {
  color: "#f44336",
  fontSize: "0.85rem",
  marginTop: "4px",
};

const submitStyle: React.CSSProperties = {
  padding: "14px 24px",
  backgroundColor: "#FF5800",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s ease",
  marginTop: "10px",
};

const passkeyContainer: React.CSSProperties = {
  flex: 1,
  minWidth: "300px",
};

const passkeyContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  textAlign: "center",
};

const passkeyDisplay: React.CSSProperties = {
  fontSize: "2.2rem",
  fontWeight: "bold",
  letterSpacing: "2px",
  color: "#FF5800",
  padding: "20px",
  border: "2px dashed #FFA726",
  borderRadius: "10px",
  margin: "20px 0",
  background: "#fffaf0",
};

const emptyPasskey: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  color: "#777",
  padding: "30px 0",
};

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  padding: "15px 25px",
  color: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 1000,
  animation: "slideIn 0.3s ease-out",
  display: "flex",
  alignItems: "center",
};

// New button styles
const whatsappButtonStyle: React.CSSProperties = {
  backgroundColor: "#25D366",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 500,
};

const smsButtonStyle: React.CSSProperties = {
  backgroundColor: "#3B82F6",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 500,
};

export default AdminPage;
