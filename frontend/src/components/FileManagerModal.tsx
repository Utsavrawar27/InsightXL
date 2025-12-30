import React, { useState, useRef, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  X,
  Upload,
  FileSpreadsheet,
  Search,
  Check,
  Trash2,
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  uploadTime: Date;
  size: number;
}

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesConfirm: (files: UploadedFile[], prompt: string) => void;
  onUploadFile: (file: File) => Promise<UploadedFile | null>;
}

const FileManagerModal: React.FC<FileManagerModalProps> = ({
  isOpen,
  onClose,
  onFilesConfirm,
  onUploadFile,
}) => {
  const { isDark } = useTheme();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.name.match(/\.(xlsx|xls|csv)$/i) ||
          file.type.includes("spreadsheet") ||
          file.type === "text/csv"
      );

      if (droppedFiles.length > 0) {
        await uploadFiles(droppedFiles);
      }
    },
    [onUploadFile]
  );

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    for (const file of filesToUpload) {
      const uploadedFile = await onUploadFile(file);
      if (uploadedFile) {
        setFiles((prev) => [...prev, uploadedFile]);
      }
    }
    setIsUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFileList = Array.from(e.target.files || []);
    if (selectedFileList.length > 0) {
      uploadFiles(selectedFileList);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map((f) => f.id)));
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  };

  const handleConfirm = () => {
    const selected = files.filter((f) => selectedFiles.has(f.id));
    if (selected.length === 0) return;

    let prompt = "";
    if (selected.length === 1) {
      prompt = `Analyze the file: ${selected[0].name}`;
    } else {
      const fileNames = selected.map((f) => f.name).join(", ");
      prompt = `Merge the following files: ${fileNames} and perform a unified analysis.`;
    }

    onFilesConfirm(selected, prompt);
    onClose();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const remainingUploads = Math.max(0, 3 - files.length);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-6 py-4 ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            File Reference
          </h2>
          <button
            onClick={onClose}
            className={`rounded-lg p-2 transition ${
              isDark
                ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
              isDragging
                ? isDark
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-blue-500 bg-blue-50"
                : isDark
                ? "border-slate-600 bg-slate-700/30 hover:border-slate-500"
                : "border-slate-300 bg-slate-50 hover:border-slate-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div
                className={`rounded-lg p-3 ${
                  isDark ? "bg-slate-600" : "bg-slate-200"
                }`}
              >
                <FileSpreadsheet
                  className={`h-10 w-10 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  <span
                    className={`text-sm ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Uploading...
                  </span>
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  Upload one or more Excel (csv) files to get started, merge,
                  clean, modify, generate charts, etc.
                </p>
              )}
            </div>
          </div>

          {/* File List Section */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h3
                className={`font-semibold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                My File
              </h3>
              {/* Search */}
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${
                  isDark
                    ? "border-slate-600 bg-slate-700"
                    : "border-slate-300 bg-white"
                }`}
              >
                <Search
                  className={`h-4 w-4 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className={`w-32 bg-transparent text-sm outline-none ${
                    isDark
                      ? "text-slate-100 placeholder-slate-400"
                      : "text-slate-900 placeholder-slate-500"
                  }`}
                />
              </div>
            </div>

            {/* File Table */}
            <div
              className={`overflow-hidden rounded-lg border ${
                isDark ? "border-slate-600" : "border-slate-200"
              }`}
            >
              {/* Table Header */}
              <div
                className={`grid grid-cols-[40px_60px_1fr_180px_40px] gap-2 px-4 py-3 text-sm font-medium ${
                  isDark
                    ? "bg-slate-700 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredFiles.length > 0 &&
                      selectedFiles.size === filteredFiles.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                </div>
                <div>#</div>
                <div>Filename</div>
                <div>Upload Time</div>
                <div></div>
              </div>

              {/* Table Body */}
              <div
                className={`max-h-48 overflow-y-auto ${
                  isDark ? "bg-slate-800" : "bg-white"
                }`}
              >
                {filteredFiles.length === 0 ? (
                  <div
                    className={`px-4 py-8 text-center text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    No files uploaded yet
                  </div>
                ) : (
                  filteredFiles.map((file, index) => (
                    <div
                      key={file.id}
                      className={`grid grid-cols-[40px_60px_1fr_180px_40px] gap-2 border-t px-4 py-3 text-sm transition ${
                        isDark
                          ? "border-slate-700 hover:bg-slate-700/50"
                          : "border-slate-100 hover:bg-slate-50"
                      } ${selectedFiles.has(file.id) ? (isDark ? "bg-blue-900/20" : "bg-blue-50") : ""}`}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="h-4 w-4 rounded accent-blue-600"
                        />
                      </div>
                      <div className={isDark ? "text-slate-400" : "text-slate-500"}>
                        {index + 1}
                      </div>
                      <div
                        className={`truncate font-medium ${
                          isDark ? "text-slate-100" : "text-slate-900"
                        }`}
                      >
                        {file.name}
                      </div>
                      <div className={isDark ? "text-slate-400" : "text-slate-500"}>
                        {formatDate(file.uploadTime)}
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className={`rounded p-1 transition ${
                            isDark
                              ? "text-slate-400 hover:bg-red-900/30 hover:text-red-400"
                              : "text-slate-400 hover:bg-red-100 hover:text-red-500"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between border-t px-6 py-4 ${
            isDark ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  filteredFiles.length > 0 &&
                  selectedFiles.size === filteredFiles.length
                }
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span
                className={`text-sm ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Select All
              </span>
            </label>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-amber-500">⚠</span>
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                You can still upload {remainingUploads} files in this
                conversation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                isDark
                  ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedFiles.size === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManagerModal;

