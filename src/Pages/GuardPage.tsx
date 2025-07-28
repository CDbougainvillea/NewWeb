// src/Pages/GuardPage.tsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import DeliverySection from "./DeliverSection";

const GuardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    await signOut(auth);
    navigate("/");
  };

  // Visitor lists
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyPasskey, setVerifyPasskey] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle visitor check-in with passkey
  const handleCheckIn = async () => {
    if (!verifyPasskey.trim()) {
      showToast("Please enter a passkey", "error");
      return;
    }

    setVerificationStatus("pending");
    try {
      // Find visitor with matching passkey
      const q = query(
        collection(db, "visitors"),
        where("passkey", "==", verifyPasskey.trim()),
        where("status", "==", "requested")
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setVerificationStatus("error");
        showToast("Invalid passkey or visitor already checked in", "error");
        return;
      }

      // Update check-in time and status
      const visitor = snapshot.docs[0];
      await updateDoc(doc(db, "visitors", visitor.id), {
        checkInTime: serverTimestamp(),
        status: "active",
      });

      setVerificationStatus("success");
      showToast(`Visitor ${visitor.data().visitorName} checked in!`, "success");
      setVerifyPasskey("");

      // Refresh visitor list
      setTimeout(() => {
        setVerificationStatus("idle");
        fetchVisitors();
      }, 2000);
    } catch (err) {
      console.error("Failed to check in visitor:", err);
      setVerificationStatus("error");
      showToast("Error checking in visitor", "error");
    }
  };

  // Handle visitor checkout
  const handleCheckout = async (id: string, name: string) => {
    try {
      await updateDoc(doc(db, "visitors", id), {
        checkOutTime: serverTimestamp(),
        status: "checked-out",
      });

      showToast(`Visitor ${name} checked out successfully`, "success");
      fetchVisitors();
    } catch (err) {
      console.error("Failed to check out visitor:", err);
      showToast("Error checking out visitor", "error");
    }
  };

  // Fetch visitors from database
  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "visitors"));
      const visitorsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        requestedAt: doc.data().requestedAt?.toDate?.() || null,
        checkInTime: doc.data().checkInTime?.toDate?.() || null,
        checkOutTime: doc.data().checkOutTime?.toDate?.() || null,
      }));

      // Sort by requested time (newest first)
      visitorsData.sort((a, b) => (b.requestedAt || 0) - (a.requestedAt || 0));
      setVisitors(visitorsData);
    } catch (err) {
      console.error("Failed to fetch visitors:", err);
      showToast("Failed to load visitors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Get active visitors
  const activeVisitors = visitors.filter((v) => v.status === "active");

  return (
    <div style={containerStyle}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            ...toastStyle,
            backgroundColor: toast.type === "success" ? "#4CAF50" : "#ff3939ff",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Top Tab Navigation */}
      <div style={tabsContainer}>
        <button
          onClick={() => setActiveTab("active")}
          style={{
            ...tabButton,
            backgroundColor: activeTab === "active" ? "#0059ffff" : "#f5f5f5",
            color: activeTab === "active" ? "white" : "#555",
          }}
        >
          <i className="fas fa-users" style={iconStyle} />
          {activeVisitors.length > 0 && (
            <span style={badgeStyle}>{activeVisitors.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("history")}
          style={{
            ...tabButton,
            backgroundColor: activeTab === "history" ? "#0059ffff" : "#f5f5f5",
            color: activeTab === "history" ? "white" : "#555",
          }}
        >
          <i className="fas fa-history" style={iconStyle} />
          <span style={badgeStyle}>{visitors.length}</span>
        </button>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          <i className="fas fa-sign-out-alt" /> Exit
        </button>
      </div>

      <div style={contentContainer}>
        {/* Active Visitors Tab */}
        {activeTab === "active" && (
          <div>
            {/* Passkey Verification Section */}
            <div style={verificationSection}>
              <div style={sectionHeader}>
                <h2 style={sectionTitle}>
                  <i className="fas fa-check-circle" style={iconStyle} />{" "}
                  Visitor Check-in
                </h2>
              </div>

              <div style={formContainer}>
                <div style={inputGroup}>
                  <label style={labelStyle}>Enter Passkey</label>
                  <div style={inputWrapper}>
                    <input
                      type="text"
                      placeholder="Visitor passkey"
                      value={verifyPasskey}
                      onChange={(e) => setVerifyPasskey(e.target.value)}
                      style={{
                        ...inputStyle,
                        textAlign: "center",
                        letterSpacing: "2px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                      }}
                      maxLength={6}
                      disabled={verificationStatus === "pending"}
                    />
                    <button
                      onClick={handleCheckIn}
                      disabled={
                        verificationStatus === "pending" ||
                        !verifyPasskey.trim()
                      }
                      style={{
                        ...submitStyle,
                        backgroundColor: "#4CAF50",
                        marginTop: "15px",
                        opacity:
                          verificationStatus === "pending" ||
                          !verifyPasskey.trim()
                            ? 0.7
                            : 1,
                        cursor:
                          verificationStatus === "pending" ||
                          !verifyPasskey.trim()
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {verificationStatus === "pending" ? (
                        <>
                          <i
                            className="fas fa-spinner fa-spin"
                            style={{ marginRight: "8px" }}
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <i
                            className="fas fa-check"
                            style={{ marginRight: "8px" }}
                          />
                          Confirm Check-in
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {verificationStatus === "success" && (
                  <div style={successMessage}>
                    <i className="fas fa-check-circle" /> Visitor checked in!
                  </div>
                )}

                {verificationStatus === "error" && (
                  <div style={errorMessage}>
                    <i className="fas fa-exclamation-triangle" /> Invalid
                    passkey
                  </div>
                )}
              </div>
            </div>
            <section
              style={{
                marginTop: "2rem",
                display: "flex",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            ></section>

            <div style={sectionHeader}>
              <h2 style={sectionTitle}>
                <i className="fas fa-user-clock" style={iconStyle} />
              </h2>
              <button
                onClick={fetchVisitors}
                disabled={loading}
                style={refreshButton}
              >
                <i className="fas fa-sync-alt" />{" "}
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div style={loadingState}>
                <i className="fas fa-spinner fa-spin" style={loadingIcon} />
                <p>Loading visitors...</p>
              </div>
            ) : activeVisitors.length === 0 ? (
              <div style={emptyState}>
                <i className="fas fa-user-check" style={emptyIcon} />
                <p>No active visitors</p>
              </div>
            ) : (
              <div style={tableContainer}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Visitor</th>
                      <th style={tableHeader}>Contact</th>
                      <th style={tableHeader}>Villa</th>
                      <th style={tableHeader}>Checked In</th>
                      <th style={tableHeader}>Passkey</th>
                      <th style={tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeVisitors.map((visitor) => (
                      <tr key={visitor.id} style={tableRow}>
                        <td style={tableCell}>
                          <div style={visitorCell}>
                            <div style={avatarPlaceholder}>
                              {visitor.visitorName
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div style={visitorName}>
                                {visitor.visitorName}
                              </div>
                              <div style={visitorPurpose}>
                                {visitor.purpose || "Visit"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={tableCell}>
                          <div style={contactCell}>
                            <div>
                              <i className="fas fa-phone" /> {visitor.phone}
                            </div>
                            {visitor.vehicle && (
                              <div>
                                <i className="fas fa-car" /> {visitor.vehicle}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={tableCell}>
                          <div style={villaBadge}>{visitor.villaNumber}</div>
                        </td>
                        <td style={tableCell}>
                          {visitor.checkInTime
                            ? visitor.checkInTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                        <td style={{ ...tableCell, fontWeight: "bold" }}>
                          <div style={passkeyBadge}>{visitor.passkey}</div>
                        </td>
                        <td style={tableCell}>
                          <button
                            onClick={() =>
                              handleCheckout(visitor.id, visitor.visitorName)
                            }
                            style={checkoutButton}
                          >
                            <i className="fas fa-sign-out-alt" />
                            Check Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <section>
              {/* Other stuff */}
              <DeliverySection />
            </section>
          </div>
        )}
        {/* Visitor History Tab */}
        {activeTab === "history" && (
          <div>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>
                <i className="fas fa-history" style={iconStyle} />
              </h2>
              <button
                onClick={fetchVisitors}
                disabled={loading}
                style={refreshButton}
              >
                <i className="fas fa-sync-alt" />{" "}
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div style={loadingState}>
                <i className="fas fa-spinner fa-spin" style={loadingIcon} />
                <p>Loading history...</p>
              </div>
            ) : visitors.length === 0 ? (
              <div style={emptyState}>
                <i className="fas fa-history" style={emptyIcon} />
                <p>No visitor records found</p>
              </div>
            ) : (
              <div style={tableContainer}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Visitor</th>
                      <th style={tableHeader}>Villa</th>
                      <th style={tableHeader}>Check-in</th>
                      <th style={tableHeader}>Check-out</th>
                      <th style={tableHeader}>Duration</th>
                      <th style={tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((visitor) => {
                      const checkIn = visitor.checkInTime;
                      const checkOut = visitor.checkOutTime;
                      let duration = "";

                      if (checkIn && checkOut) {
                        const diff = Math.abs(checkOut - checkIn);
                        const hours = Math.floor(diff / 3600000);
                        const minutes = Math.floor((diff % 3600000) / 60000);
                        duration = `${hours}h ${minutes}m`;
                      }

                      return (
                        <tr
                          key={visitor.id}
                          style={{
                            ...tableRow,
                            backgroundColor:
                              visitor.status === "active"
                                ? "#f0f9ff"
                                : "transparent",
                          }}
                        >
                          <td style={tableCell}>
                            <div style={visitorCell}>
                              <div style={avatarPlaceholder}>
                                {visitor.visitorName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <div style={visitorName}>
                                  {visitor.visitorName}
                                </div>
                                <div style={visitorPurpose}>
                                  {visitor.purpose || "Visit"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={tableCell}>
                            <div style={villaBadge}>{visitor.villaNumber}</div>
                          </td>
                          <td style={tableCell}>
                            {checkIn ? (
                              checkIn.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            ) : (
                              <span style={{ color: "#f44336" }}>
                                Not checked in
                              </span>
                            )}
                          </td>
                          <td style={tableCell}>
                            {checkOut ? (
                              checkOut.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            ) : (
                              <span
                                style={{
                                  color:
                                    visitor.status === "active"
                                      ? "#4CAF50"
                                      : "#f44336",
                                }}
                              >
                                {visitor.status === "active"
                                  ? "Active"
                                  : "Not checked out"}
                              </span>
                            )}
                          </td>
                          <td style={tableCell}>{duration}</td>
                          <td style={tableCell}>
                            <div
                              style={{
                                ...statusBadge,
                                backgroundColor:
                                  visitor.status === "active"
                                    ? "#4CAF50"
                                    : visitor.status === "checked-out"
                                    ? "#2196F3"
                                    : "#9E9E9E",
                              }}
                            >
                              {visitor.status === "active"
                                ? "Active"
                                : visitor.status === "checked-out"
                                ? "Checked Out"
                                : "Requested"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global styles for icons */}
      <style>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ---------- Styles ----------
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#f8f9fa",
  overflow: "hidden",
};

const logoutButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #ff4141ff",
  color: "#ff2626ff",
  padding: "8px 16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s ease",
};

const tabsContainer: React.CSSProperties = {
  display: "flex",
  backgroundColor: "#fff",
  borderRadius: "0 0 10px 10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  marginBottom: "20px",
};

const tabButton: React.CSSProperties = {
  flex: 1,
  padding: "18px 20px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  transition: "all 0.2s ease",
  position: "relative",
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#FF5800",
  color: "white",
  borderRadius: "10px",
  padding: "2px 8px",
  fontSize: "0.8rem",
  marginLeft: "8px",
};

const contentContainer: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "0 20px 20px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
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

const verificationSection: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "25px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  marginBottom: "30px",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.5rem",
  marginBottom: "0",
  color: "#333",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const formContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const inputGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginBottom: "15px",
};

const inputWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const labelStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: "500",
  color: "#555",
  textAlign: "center",
};

const inputStyle: React.CSSProperties = {
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  backgroundColor: "#fff",
  transition: "all 0.2s ease",
  width: "100%",
  maxWidth: "300px",
};

const submitStyle: React.CSSProperties = {
  padding: "14px 24px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  width: "100%",
  maxWidth: "300px",
};

const refreshButton: React.CSSProperties = {
  padding: "10px 15px",
  backgroundColor: "#2196F3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 500,
};

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px 20px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  color: "#777",
  textAlign: "center",
};

const loadingState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "50px 20px",
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  color: "#555",
  textAlign: "center",
};

const loadingIcon: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "20px",
  color: "#FF5800",
};

const emptyIcon: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: "20px",
  color: "#ddd",
};

const tableContainer: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableHeader: React.CSSProperties = {
  backgroundColor: "#f0f2f5",
  padding: "15px",
  textAlign: "left",
  fontWeight: "600",
  color: "#444",
};

const tableRow: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  transition: "background-color 0.2s",
};

const tableCell: React.CSSProperties = {
  padding: "15px",
  color: "#555",
};

const checkoutButton: React.CSSProperties = {
  padding: "8px 15px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const successMessage: React.CSSProperties = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "15px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  justifyContent: "center",
};

const errorMessage: React.CSSProperties = {
  backgroundColor: "#f44336",
  color: "white",
  padding: "10px",
  borderRadius: "6px",
  marginTop: "15px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  justifyContent: "center",
};

const iconStyle: React.CSSProperties = {
  width: "20px",
  textAlign: "center",
};

const visitorCell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatarPlaceholder: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#FF5800",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  flexShrink: 0,
};

const visitorName: React.CSSProperties = {
  fontWeight: "600",
  fontSize: "1rem",
};

const visitorPurpose: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#777",
};

const contactCell: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const villaBadge: React.CSSProperties = {
  backgroundColor: "#E1F5FE",
  color: "#0288D1",
  padding: "5px 10px",
  borderRadius: "20px",
  fontWeight: "600",
  display: "inline-block",
};

const passkeyBadge: React.CSSProperties = {
  backgroundColor: "#E8F5E9",
  color: "#4CAF50",
  padding: "5px 10px",
  borderRadius: "20px",
  fontWeight: "600",
  display: "inline-block",
};

const statusBadge: React.CSSProperties = {
  color: "white",
  padding: "5px 10px",
  borderRadius: "20px",
  fontWeight: "600",
  display: "inline-block",
  fontSize: "0.85rem",
};

export default GuardPage;
