// src/Pages/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(email === "guard@guard.com" ? "/guard" : "/admin");
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const userEmail = result.user.email || "";

  //     if (!["guard@guard.com", "admin@admin.com"].includes(userEmail)) {
  //       await auth.signOut();
  //       alert("Unauthorized user");
  //       return;
  //     }

  //     navigate(userEmail === "guard@guard.com" ? "/guard" : "/admin");
  //   } catch (error) {
  //     console.error("Google login failed", error);
  //     alert("Google login failed");
  //   }
  // };

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

          {/* 💎 Stylish Google Button */}
          {/* <button onClick={handleGoogleLogin} style={styles.googleButton}>
            <span style={styles.googleIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.72 1.22 9.2 3.23l6.86-6.86C35.94 2.1 30.34 0 24 0 14.92 0 6.97 5.52 2.86 13.5l7.99 6.2C13.08 13.9 18.14 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24c0-1.36-.14-2.68-.41-3.94H24v7.48h12.7c-1.08 3.1-3.27 5.67-6.22 7.42l8.03 6.22C42.99 36.14 46.5 30.6 46.5 24z"
                />
                <path
                  fill="#4A90E2"
                  d="M10.84 27.66c-.5-1.48-.78-3.06-.78-4.66s.28-3.18.78-4.66l-7.99-6.2C.94 16.88 0 20.34 0 24s.94 7.12 2.86 10.34l7.98-6.2z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 46.5c6.34 0 11.94-2.1 16.06-5.92l-8.03-6.22c-2.23 1.5-5.02 2.38-8.03 2.38-5.86 0-10.92-4.4-13.14-10.2l-7.99 6.2C6.97 42.48 14.92 46.5 24 46.5z"
                />
              </svg>
            </span>
            <span style={styles.googleText}>Sign in with Google</span>
          </button> */}

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
    marginTop: "1rem",
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
