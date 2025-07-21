// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/Login";
import ProtectedRoute from "./Routes/Protected";
import AdminPage from "./Pages/AdminPage";
import GuardPage from "./Pages/GuardPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsPage from "./Pages/TermsPage";



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard"
          element={
            <ProtectedRoute role="guard">
              <GuardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
