import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const DeliveryHistory: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    const q = query(
      collection(db, "deliveryLogs"),
      orderBy("entryTime", "desc")
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLogs(data);
    setLoading(false);
  };

  const handleCheckout = async (logId: string) => {
    await updateDoc(doc(db, "deliveryLogs", logId), {
      exitTime: Timestamp.now(),
    });
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.cardContainer}>
        <h3 style={styles.sectionHeader}>Delivery History</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.scrollArea}>
            {logs.map((log) => {
              const entryTime = log.entryTime?.toDate();
              const exitTime = log.exitTime?.toDate();
              const isActive = !exitTime;

              const duration = isActive
                ? dayjs(entryTime).fromNow(true)
                : dayjs(exitTime).to(entryTime, true);

              const formattedEntry = entryTime
                ? dayjs(entryTime).format("DD MMM YYYY, hh:mm A")
                : "—";

              const formattedExit = exitTime
                ? dayjs(exitTime).format("DD MMM YYYY, hh:mm A")
                : null;

              return (
                <div key={log.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.name}>
                      <strong>Name:</strong> {log.name}
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: isActive ? "#d1fae5" : "#f3f4f6",
                        color: isActive ? "#047857" : "#6b7280",
                      }}
                    >
                      {isActive ? "ACTIVE" : "OUT"}
                    </span>
                  </div>

                  <div style={styles.details}>
                    <div>
                      <strong>Company:</strong> {log.company || "—"}
                    </div>
                    <div>
                      <strong>Vehicle No:</strong>{" "}
                      {log.vehicleNumber || "No Vehicle"}
                    </div>
                    <div>
                      <strong>Entry Time:</strong> {formattedEntry}
                    </div>
                    {formattedExit && (
                      <div>
                        <strong>Exit Time:</strong> {formattedExit}
                      </div>
                    )}
                    <div>
                      <strong>Duration:</strong> {duration}
                    </div>
                  </div>

                  {isActive && (
                    <div style={styles.cardFooter}>
                      <button
                        onClick={() => handleCheckout(log.id)}
                        style={styles.checkoutBtn}
                      >
                        Check Out
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={styles.refreshWrapper}>
          <button onClick={fetchLogs} style={styles.refreshBtn}>
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "0.5rem",
    width: "100%",
  },
  cardContainer: {
    background: "#fff",
    borderRadius: "10px",
    padding: "1rem",
    width: "100%",
    maxWidth: 480,
    display: "flex",
    flexDirection: "column",
  },
  sectionHeader: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    color: "#111827",
  },
  scrollArea: {
    maxHeight: "330px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    paddingRight: "4px",
    scrollbarWidth: "thin" as any,
    WebkitOverflowScrolling: "touch",
  },
  card: {
    borderRadius: "10px",
    padding: "12px",
    backgroundColor: "#f9fafb",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    fontSize: "0.9rem",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  name: {
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "#1f2937",
  },
  statusBadge: {
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "0.85rem",
    color: "#374151",
    lineHeight: 1.3,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
  },
  checkoutBtn: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.8rem",
  },
  refreshWrapper: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  refreshBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    fontWeight: 600,
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    marginTop: "6px",
  },
};

export default DeliveryHistory;
