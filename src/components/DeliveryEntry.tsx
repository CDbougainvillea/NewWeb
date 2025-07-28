import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

const DeliveryEntryForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [villa, setVilla] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);

    if (!name || !phone || !license || !vehicle || !villa || !company) {
      setError("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "deliveryLogs"), {
        name,
        phone,
        license,
        vehicleNumber: vehicle,
        villa,
        company,
        entryTime: Timestamp.now(),
        exitTime: null,
      });

      setSuccess(true);
      setName("");
      setPhone("");
      setLicense("");
      setVehicle("");
      setVilla("");
      setCompany("");
    } catch (err) {
      setError("Failed to log entry");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.cardContainer}>
        <h3 style={styles.sectionHeader}>Delivery Entry</h3>

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Delivery Person Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="License Number"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Vehicle Number"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Villa/Flat Number"
            value={villa}
            onChange={(e) => setVilla(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Delivery Company (e.g., Swiggy, Amazon)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleSubmit} style={styles.submitBtn}>
            + Log Delivery Entry
          </button>

          {error && <p style={styles.error}>❌ {error}</p>}
          {success && (
            <p style={styles.success}>✅ Entry recorded successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "0rem",
  },
  cardContainer: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "1rem",
    flex: 1,
    maxWidth: 500,
  },
  sectionHeader: {
    fontSize: "1.25rem",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
  },
  submitBtn: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "#dc3545",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
  success: {
    color: "#28a745",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default DeliveryEntryForm;
