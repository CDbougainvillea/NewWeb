import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  getIdTokenResult,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

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

      // Check session age
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

      // Role-based check
      const email = user.email || "";
      const isGuard = email === "guard@guard.com";
      const isAdmin = email !== "guard@guard.com";

      if ((role === "guard" && isGuard) || (role === "admin" && isAdmin)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate, role]);

  if (isAllowed === null) return <p>Loading...</p>;
  if (!isAllowed) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
