import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { User } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Paperclip, Send } from "lucide-react";
import FileManagerModal from "./FileManagerModal";
import ChartSelectorPopover from "./ChartSelectorPopover";
import ChartRenderer from "./ChartRenderer";

interface ChartData {
  type: "chart";
  chartType: "bar" | "line" | "pie" | "area" | "radar";
  title: string;
  description: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data: Array<{ name: string; value: number; [key: string]: any }>;
  insights?: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chartData?: ChartData;
  timestamp: Date;
}

interface ChatWithExcelProps {
  user: User | null;
  onShowLogin: () => void;
}

interface UploadedFileRef {
  id: string;
  name: string;
  uploadTime: Date;
  size: number;
}

const ChatWithExcel: React.FC<ChatWithExcelProps> = ({ user, onShowLogin }) => {
  const { isDark } = useTheme();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      onShowLogin();
      return;
    }

    // Check file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert("Please upload a valid Excel or CSV file");
      return;
    }

    // Check file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    setUploadedFile(file);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setFileData(data);
      setSuggestions(data.suggestions || []);

      // Add welcome message
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Hello! I've analyzed your file "${file.name}". ${data.summary || "It contains " + data.row_count + " rows and " + data.column_count + " columns."}\n\nYou can ask questions or perform operations on this file. Here are some suggestions to get started:`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload and analyze file. Please try again.");
      setUploadedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const sendMessage = async (content: string) => {
    if (!uploadedFile || !user) {
      onShowLogin();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          file_id: fileData?.file_id,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Check if the response is chart data (JSON)
      let chartData: ChartData | undefined;
      let textContent = data.response;

      try {
        // Try to parse as JSON chart data
        const parsed = JSON.parse(data.response);
        if (parsed.type === "chart" && parsed.chartType && parsed.data) {
          chartData = parsed as ChartData;
          textContent = ""; // No text content for chart responses
        } else if (parsed.type === "error") {
          textContent = parsed.message || "An error occurred.";
        }
      } catch {
        // Not JSON, treat as regular text response
        chartData = undefined;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: textContent,
        chartData,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileData(null);
    setSuggestions([]);
    setMessages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChartPromptSelect = (prompt: string) => {
    setInputMessage(prompt);
    // Focus on the input after selecting a chart template
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleFileModalUpload = async (file: File): Promise<UploadedFileRef | null> => {
    if (!user) {
      onShowLogin();
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/chat/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      return {
        id: data.file_id || Date.now().toString(),
        name: file.name,
        uploadTime: new Date(),
        size: file.size,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFilesConfirm = (files: UploadedFileRef[], prompt: string) => {
    setInputMessage(prompt);
    if (files.length > 0) {
      // Set the first file as the active file for context
      setFileData({ file_id: files[0].id });
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      {!uploadedFile ? (
        /* Upload State */
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-2xl text-center">
            {/* Upload Area */}
            <div
              className={`rounded-2xl border-2 border-dashed p-12 transition ${
                isDark
                  ? "border-slate-600 bg-slate-800/50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className={`rounded-full p-4 ${
                    isDark ? "bg-blue-900/40" : "bg-blue-100"
                  }`}
                >
                  <svg
                    className={`h-12 w-12 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <h3
                className={`mb-2 text-xl font-semibold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Upload Your Excel or CSV File
              </h3>
              <p
                className={`mb-6 text-sm ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Start analyzing your data with AI-powered insights
              </p>

              {/* Upload Button */}
              <button
                onClick={() => {
                  if (!user) {
                    onShowLogin();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Choose File to Upload
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
                  <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Please log in first
                  </span>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6">
              <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Supported formats: .xlsx, .xls, .csv • Max file size: 50MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Chat State */
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* File Info Header */}
          <div
            className={`flex items-center justify-between border-b px-6 py-4 ${
              isDark
                ? "border-slate-700 bg-slate-800/50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`rounded-lg p-2 ${
                  isDark ? "bg-green-900/40" : "bg-green-100"
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className={`font-medium ${
                    isDark ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  {uploadedFile.name}
                </p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                  {fileData && ` • ${fileData.row_count} rows × ${fileData.column_count} columns`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className={`rounded-lg p-2 transition ${
                isDark
                  ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
              }`}
              title="Remove file"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div
            className={`flex-1 overflow-y-auto p-6 ${
              isDark ? "bg-slate-900" : "bg-white"
            }`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Analyzing your file...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div className="max-w-3xl rounded-2xl bg-blue-600 px-4 py-3 text-white">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    ) : message.chartData ? (
                      /* Chart Response */
                      <div className="w-full max-w-4xl">
                        <ChartRenderer chartData={message.chartData} />
                      </div>
                    ) : (
                      /* Text Response */
                      <div
                        className={`max-w-4xl rounded-2xl px-6 py-4 ${
                          isDark
                            ? "bg-slate-800 text-slate-100"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <div
                          className={`prose prose-sm max-w-none ${
                            isDark ? "prose-invert" : ""
                          } ${isDark ? "prose-headings:text-slate-100" : "prose-headings:text-slate-900"}`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({ children }) => (
                                <div className="my-4 overflow-x-auto">
                                  <table
                                    className={`min-w-full border-collapse rounded-lg text-sm ${
                                      isDark
                                        ? "border-slate-600"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead
                                  className={`${
                                    isDark
                                      ? "bg-slate-700 text-slate-200"
                                      : "bg-slate-200 text-slate-800"
                                  }`}
                                >
                                  {children}
                                </thead>
                              ),
                              th: ({ children }) => (
                                <th
                                  className={`border px-4 py-2 text-left font-semibold ${
                                    isDark
                                      ? "border-slate-600"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td
                                  className={`border px-4 py-2 ${
                                    isDark
                                      ? "border-slate-600"
                                      : "border-slate-300"
                                  }`}
                                >
                                  {children}
                                </td>
                              ),
                              tr: ({ children }) => (
                                <tr
                                  className={`${
                                    isDark
                                      ? "even:bg-slate-700/50 hover:bg-slate-700"
                                      : "even:bg-slate-50 hover:bg-slate-100"
                                  }`}
                                >
                                  {children}
                                </tr>
                              ),
                              h2: ({ children }) => (
                                <h2
                                  className={`mb-4 mt-6 border-b pb-2 text-xl font-bold ${
                                    isDark
                                      ? "border-slate-600 text-blue-400"
                                      : "border-slate-300 text-blue-600"
                                  }`}
                                >
                                  {children}
                                </h2>
                              ),
                              h3: ({ children }) => (
                                <h3
                                  className={`mb-3 mt-4 text-lg font-semibold ${
                                    isDark ? "text-slate-200" : "text-slate-800"
                                  }`}
                                >
                                  {children}
                                </h3>
                              ),
                              strong: ({ children }) => (
                                <strong
                                  className={`font-semibold ${
                                    isDark ? "text-blue-300" : "text-blue-700"
                                  }`}
                                >
                                  {children}
                                </strong>
                              ),
                              ul: ({ children }) => (
                                <ul
                                  className={`my-2 list-disc pl-6 ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                  }`}
                                >
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol
                                  className={`my-2 list-decimal pl-6 ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                  }`}
                                >
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="my-1">{children}</li>
                              ),
                              p: ({ children }) => (
                                <p
                                  className={`my-2 leading-relaxed ${
                                    isDark ? "text-slate-300" : "text-slate-700"
                                  }`}
                                >
                                  {children}
                                </p>
                              ),
                              hr: () => (
                                <hr
                                  className={`my-4 ${
                                    isDark
                                      ? "border-slate-600"
                                      : "border-slate-300"
                                  }`}
                                />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Suggestions */}
                {suggestions.length > 0 && messages.length === 1 && (
                  <div className="space-y-2 pt-2">
                    <p
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Suggestions:
                    </p>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                          isDark
                            ? "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="mr-2">→</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 animate-bounce rounded-full ${
                            isDark ? "bg-slate-400" : "bg-slate-600"
                          }`}
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className={`h-2 w-2 animate-bounce rounded-full ${
                            isDark ? "bg-slate-400" : "bg-slate-600"
                          }`}
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className={`h-2 w-2 animate-bounce rounded-full ${
                            isDark ? "bg-slate-400" : "bg-slate-600"
                          }`}
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Professional Input Area */}
          <div
            className={`border-t p-4 ${
              isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
            }`}
          >
            {/* Input Container */}
            <div
              className={`rounded-2xl border transition-all ${
                isDark
                  ? "border-slate-600 bg-slate-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
                  : "border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
              }`}
            >
              {/* Textarea */}
              <div className="px-4 py-3">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="You can ask questions or perform operations on the file to be analyzed"
                  disabled={isLoading || isAnalyzing}
                  rows={2}
                  className={`w-full resize-none bg-transparent text-sm outline-none ${
                    isDark
                      ? "text-slate-100 placeholder-slate-400"
                      : "text-slate-900 placeholder-slate-500"
                  } disabled:opacity-50`}
                />
              </div>

              {/* Bottom Toolbar */}
              <div
                className={`flex items-center justify-between border-t px-3 py-2 ${
                  isDark ? "border-slate-700" : "border-slate-100"
                }`}
              >
                {/* Left Side - Tools */}
                <div className="flex items-center gap-1">
                  {/* File Attachment Button */}
                  <button
                    onClick={() => {
                      if (!user) {
                        onShowLogin();
                      } else {
                        setIsFileModalOpen(true);
                      }
                    }}
                    className={`rounded-lg p-2 transition ${
                      isDark
                        ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                    title="Attach files"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  {/* Chart Selector */}
                  <ChartSelectorPopover onSelectChart={handleChartPromptSelect} />
                </div>

                {/* Right Side - Send Button */}
                <button
                  onClick={(e) => handleSendMessage(e)}
                  disabled={isLoading || isAnalyzing || !inputMessage.trim()}
                  className={`rounded-full p-2 transition ${
                    inputMessage.trim()
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : isDark
                      ? "bg-slate-700 text-slate-500"
                      : "bg-slate-100 text-slate-400"
                  } disabled:cursor-not-allowed`}
                  title="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* File Manager Modal */}
          <FileManagerModal
            isOpen={isFileModalOpen}
            onClose={() => setIsFileModalOpen(false)}
            onFilesConfirm={handleFilesConfirm}
            onUploadFile={handleFileModalUpload}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWithExcel;

