import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/chat" replace />} />
        <Route path="/dashboard/chat" element={<Dashboard />} />
        <Route path="/dashboard/image-to-excel" element={<Dashboard />} />
        <Route path="/dashboard/pdf-to-excel" element={<Dashboard />} />
        <Route path="/dashboard/excel-to-dashboard" element={<Dashboard />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
