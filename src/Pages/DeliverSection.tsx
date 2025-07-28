import React, { useEffect, useState } from "react";
import DeliveryEntryForm from "../components/DeliveryEntry";
import DeliveryHistory from "../components/Deliveryhist";

const DeliverySection: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Listen to window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Delivery Management</h2>
      </div>

      <div
        style={{
          ...styles.container,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ ...styles.box, width: isMobile ? "100%" : "48%" }}>
          <DeliveryEntryForm />
        </div>
        <div style={{ ...styles.box, width: isMobile ? "100%" : "48%" }}>
          <DeliveryHistory />
        </div>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    padding: "2rem 1rem",
    borderRadius: "12px",
    marginTop: "2rem",
    maxWidth: "1200px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    textAlign: "start",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 600,
    color: "#333",
  },
  container: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  box: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
  },
};

export default DeliverySection;
