import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface ExcelToDashboardProps {
  user: { email: string; name: string } | null;
  onShowLogin: () => void;
}

const ExcelToDashboard: React.FC<ExcelToDashboardProps> = ({
  user,
  onShowLogin,
}) => {
  const { isDark } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      onShowLogin();
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // TODO: Send to backend for dashboard creation
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex-1 overflow-y-auto p-8 ${
          isDark ? "bg-slate-900" : "bg-slate-50"
        }`}
      >
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className={`mb-3 text-4xl font-bold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Turn Data Into A{" "}
              <span className="text-blue-600">Visual</span> Dashboard
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Simplify complexity, transform data quickly, and make insights
              clear at a glance
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`rounded-2xl border-2 border-dashed p-12 text-center shadow-sm transition ${
              isDark
                ? "border-slate-600 bg-slate-800 hover:border-blue-500"
                : "border-slate-300 bg-white hover:border-blue-400"
            }`}
          >
            <input
              type="file"
              id="excel-dashboard-upload"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="excel-dashboard-upload"
              className="flex cursor-pointer flex-col items-center"
            >
              {/* Excel Icon */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <svg
                    className="h-20 w-20 text-slate-300"
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
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Excel
                  </div>
                </div>
              </div>

              <p
                className={`mb-2 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Click here or drag an Excel (csv) file here to upload
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
                  onShowLogin();
                } else {
                  document.getElementById("excel-dashboard-upload")?.click();
                }
              }}
            >
              {selectedFile
                ? "Start a conversation with my file"
                : "Upload Excel File"}
            </button>

            {selectedFile && (
              <button
                className="ml-3 mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                onClick={() => {
                  // TODO: Create dashboard from file
                  console.log("Create dashboard:", selectedFile);
                }}
              >
                Generate Dashboard
              </button>
            )}
          </div>

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

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Supported formats: .xlsx, .xls, .csv • Max file size: 50MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelToDashboard;

