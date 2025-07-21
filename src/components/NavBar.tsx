// src/Components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

// Add this font in your index.html <head> (see next step)
const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        CD Bougainvillea
      </Link>
      <div style={styles.links}>
        <Link to="/login" style={styles.link}>
          Login
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 10px rgba(255, 255, 255, 1)",
    fontFamily: "'Pinyon Script', cursive", // fallback included
  },
  brand: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#000000ff",
    fontFamily: "'Pinyon Script', cursive", // calligraphy font
    letterSpacing: "1px",
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#000000",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background 0.3s ease",
  },
};

export default Navbar;
