import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

interface ImageToExcelProps {
  user: { email: string; name: string } | null;
  onShowLogin: () => void;
}

const ImageToExcel: React.FC<ImageToExcelProps> = ({ user, onShowLogin }) => {
  const { isDark } = useTheme();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      onShowLogin();
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // TODO: Send to backend for processing
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
              Extract table data from{" "}
              <span className="text-blue-600">images</span>
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Upload your image and let AI instantly convert any image containing
              table data into a table. Then start chatting with it!
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
              id="image-upload"
              className="hidden"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="image-upload"
              className="flex cursor-pointer flex-col items-center"
            >
              {preview ? (
                <div className="mb-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 rounded-lg border border-slate-200"
                  />
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-4">
                  {/* JPG Icon */}
                  <div className="relative">
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
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      JPG
                    </div>
                  </div>

                  {/* PNG Icon */}
                  <div className="relative">
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
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      PNG
                    </div>
                  </div>
                </div>
              )}

              <p
                className={`mb-2 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Please upload any image containing tabular data. Supported
                formats include JPG, PNG, etc.
              </p>

              {selectedImage && (
                <div className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  Selected: {selectedImage.name}
                </div>
              )}
            </label>

            {!preview && (
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
                    document.getElementById("image-upload")?.click();
                  }
                }}
              >
                Upload Image
              </button>
            )}

            {preview && (
              <button
                className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                onClick={() => {
                  // TODO: Process image and extract table
                  console.log("Process image:", selectedImage);
                }}
              >
                Extract Table from Image
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
              Supported formats: .jpg, .jpeg, .png, .gif, .bmp • Max file size: 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToExcel;

