import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import LoginModal from "./LoginModal";
import ImageToExcel from "./ImageToExcel";
import PdfToExcel from "./PdfToExcel";
import ExcelToDashboard from "./ExcelToDashboard";

interface DashboardProps {
  onBack?: () => void;
}

interface User {
  email: string;
  name: string;
}

type ActiveFeature = "chat" | "image" | "pdf" | "dashboard";

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>("chat");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setShowLoginModal(true);
      e.target.value = ""; // Reset file input
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // TODO: Handle file upload to backend
    }
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedFile(null);
  };

  return (
    <div
      className={`flex h-screen ${
        isDark ? "bg-slate-900" : "bg-slate-50"
      }`}
    >
      {/* Left Sidebar */}
      <aside
        className={`flex w-72 flex-col border-r ${
          isDark
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Logo/Header */}
        <div
          className={`flex items-center gap-2 border-b px-4 py-4 ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            IX
          </div>
          <span
            className={`text-lg font-semibold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            InsightXL
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            <button
              onClick={() => setActiveFeature("chat")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeFeature === "chat"
                  ? isDark
                    ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Chat With Excel
            </button>

            <button
              onClick={() => setActiveFeature("image")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeFeature === "image"
                  ? isDark
                    ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Image To Excel
            </button>

            <button
              onClick={() => setActiveFeature("pdf")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeFeature === "pdf"
                  ? isDark
                    ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              PDF To Excel
            </button>

            <button
              onClick={() => setActiveFeature("dashboard")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeFeature === "dashboard"
                  ? isDark
                    ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : isDark
                  ? "text-slate-300 hover:bg-slate-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Excel To Dashboard
            </button>

            {/* Chat History Dropdown */}
            <div className="pt-4">
              <button
                onClick={() => setChatHistoryOpen(!chatHistoryOpen)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isDark
                    ? "text-slate-300 hover:bg-slate-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Chat History
                </div>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    chatHistoryOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {chatHistoryOpen && (
                <div className="mt-1 space-y-1 pl-4">
                  <div className="rounded-lg px-4 py-2 text-xs text-slate-500">
                    No chat history yet
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Bottom Section - Login/Register or User Info */}
        <div
          className={`border-t p-4 ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          {user ? (
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    isDark
                      ? "bg-blue-900/40 text-blue-300"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-slate-100" : "text-slate-900"
                    }`}
                  >
                    {user.name}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`w-full rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3 text-center">
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  Login to enjoy more
                </p>
                <p
                  className={`mt-1 text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  AI-Powered Excel Data Analysis and Visualization
                </p>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Login/Register
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className={`flex items-center justify-between border-b px-6 py-4 ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                ← Back to Home
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-sm transition ${
                isDark
                  ? "border-slate-600 bg-slate-700 text-slate-200 hover:border-sky-400 hover:text-sky-300"
                  : "border-slate-300 bg-slate-100 text-slate-700 hover:border-sky-400 hover:text-sky-600"
              }`}
            >
              <span>{isDark ? "🌙 Night" : "☀ Day"}</span>
            </button>
            <button
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                isDark
                  ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Help
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Upgrade to Pro
            </button>
          </div>
        </header>

        {/* Main Content - Dynamic based on active feature */}
        {activeFeature === "chat" && (
          <div
            className={`flex flex-1 items-center justify-center overflow-y-auto p-8 ${
              isDark ? "bg-slate-900" : "bg-slate-50"
            }`}
          >
            <div className="w-full max-w-4xl">
            <div className="mb-8 text-center">
              <h1
                className={`mb-3 text-4xl font-bold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                <span className="text-blue-600">Analyze Your Excel</span>{" "}
                <span className="relative">
                  Through A Simple Conversation
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 400 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 6C80 2 160 2 200 3C240 4 320 4 398 6"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                No formulas. No VBA. Just upload your file, chat, and let AI
                handle the rest
              </p>
            </div>

            {/* Upload Box */}
            <div
              className={`rounded-2xl border-2 border-dashed p-12 text-center shadow-sm transition ${
                isDark
                  ? "border-slate-600 bg-slate-800 hover:border-blue-500"
                  : "border-slate-300 bg-white hover:border-blue-400"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center"
              >
                {/* File Icon */}
                <div className="mb-6">
                  <svg
                    className="h-20 w-20 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <p
                  className={`mb-2 text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Upload one or more Excel (csv) files to get started, merge,
                  clean, modify, generate charts, etc.
                </p>

                {selectedFile && (
                  <div className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </label>

              <button
                className={`mt-8 rounded-lg border px-6 py-3 text-sm font-medium transition ${
                  isDark
                    ? "border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => {
                  if (!user) {
                    setShowLoginModal(true);
                  } else {
                    document.getElementById("file-upload")?.click();
                  }
                }}
              >
                Start a conversation with my file
              </button>

              {/* Login prompt when not logged in */}
              {!user && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <svg
                    className="h-5 w-5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-slate-600">Please log in first</span>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Supported formats: .xlsx, .xls, .csv • Max file size: 50MB
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Image To Excel Feature */}
        {activeFeature === "image" && (
          <ImageToExcel
            user={user}
            onShowLogin={() => setShowLoginModal(true)}
          />
        )}

        {/* PDF To Excel Feature */}
        {activeFeature === "pdf" && (
          <PdfToExcel user={user} onShowLogin={() => setShowLoginModal(true)} />
        )}

        {/* Excel To Dashboard Feature */}
        {activeFeature === "dashboard" && (
          <ExcelToDashboard
            user={user}
            onShowLogin={() => setShowLoginModal(true)}
          />
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Dashboard;

