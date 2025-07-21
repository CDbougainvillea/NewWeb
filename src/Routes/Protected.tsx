// src/Routes/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAllowed(false);
        return navigate("/");
      }

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
