// src/components/Auth/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  getIdTokenResult,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import roles from "../firebase/roles.json"; // <-- Import the role list

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "guard" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setIsAllowed(false);
        return navigate("/");
      }

      const tokenResult = await getIdTokenResult(user);
      const authTime = Number(tokenResult.claims.auth_time) * 1000;
      const now = Date.now();
      const hoursSinceLogin = (now - authTime) / (1000 * 60 * 60);

      if (hoursSinceLogin >= 24) {
        await signOut(auth);
        alert("Session expired. Please log in again.");
        navigate("/", { replace: true });
        return;
      }

      const email = user.email || "";
      const allowedEmails = roles[role]; // role-based lookup

      if (allowedEmails.includes(email)) {
        setIsAllowed(true);
      } else {
        alert("Unauthorized access.");
        await signOut(auth);
        setIsAllowed(false);
        navigate("/", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate, role]);

  if (isAllowed === null) return <p>Loading...</p>;
  if (!isAllowed) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
