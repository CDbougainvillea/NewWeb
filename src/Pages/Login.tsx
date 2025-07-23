// src/Pages/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { getRedirectResult } from "firebase/auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role;

      if (role === "guard") {
        navigate("/guard", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        alert("Unauthorized user");
        await auth.signOut();
      }
    } catch (err) {
      alert("Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const email = result.user.email || "";
          if (!["guard@guard.com", "admin@admin.com"].includes(email)) {
            auth.signOut();
            alert("Unauthorized user");
            return;
          }
          navigate(email === "guard@guard.com" ? "/guard" : "/admin", {
            replace: true,
          });
        }
      })
      .catch((error) => {
        console.error("Google redirect login failed", error);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <style>
        {`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
      </style>

      <Navbar />
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign In</h2>

          <div style={styles.inputWrapper}>
            <FiMail style={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <FiLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <span
              onClick={() => setShowPassword((v) => !v)}
              style={styles.toggle}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            onClick={handleLogin}
            style={styles.button}
            disabled={loading}
          >
            {loading ? <div style={styles.spinner}></div> : "Log In"}
          </button>

          <p style={styles.links}>
            By logging in, you agree to our Privacy Policy and Terms &
            Conditions
          </p>

          <div style={styles.links}>
            <Link to="/privacy-policy" style={styles.link}>
              Privacy Policy
            </Link>
            <span style={styles.separator}>|</span>
            <Link to="/terms" style={styles.link}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage:
      "url('https://images.pexels.com/photos/6585279/pexels-photo-6585279.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  card: {
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "2rem",
    maxWidth: "400px",
    width: "90%",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.2rem",
    alignItems: "center",
  },

  title: {
    fontSize: "2rem",
    color: "#fff",
  },

  inputWrapper: {
    position: "relative" as const,
    width: "100%",
  },

  input: {
    width: "100%",
    padding: "0.75rem 2.5rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
  },

  icon: {
    position: "absolute" as const,
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
  },

  toggle: {
    position: "absolute" as const,
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#aaa",
  },

  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    background: "#111",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },

  googleButton: {
    width: "100%",
    padding: "0.7rem 1rem",
    backgroundColor: "#fff",
    color: "#444",
    border: "1px solid #ddd",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
    fontSize: "0.95rem",
    gap: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  googleIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  googleText: {
    fontWeight: 600,
    fontSize: "1rem",
  },

  links: {
    marginTop: "0rem",
    fontSize: "0.8rem",
    color: "#ddd",
    display: "flex",
    gap: "0.5rem",
  },

  link: {
    textDecoration: "none",
    color: "#fff",
  },

  separator: {
    color: "#ccc",
  },
};

export default LoginPage;
