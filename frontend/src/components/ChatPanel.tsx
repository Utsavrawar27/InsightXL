import React, { useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  onSend: (message: string) => void;
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSend, messages, isLoading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-full flex-col border-r border-slate-800 bg-slate-950/60">
      <div className="border-b border-slate-800 px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">InsightXL Agent</h1>
        <p className="text-xs text-slate-400">
          Ask anything about your spreadsheet, analytics, or charts.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-400">
            Try: &quot;Clean this column and remove duplicates&quot; or
            &quot;Create a revenue vs. time line chart&quot;.
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-sky-600 text-slate-50"
                  : "bg-slate-900 text-slate-100 border border-slate-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-xs text-slate-400 border border-slate-800">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-800 bg-slate-950/80 px-3 py-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to do with your data…"
            className="min-h-[40px] flex-1 resize-none rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs outline-none ring-0 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex h-9 items-center rounded-lg bg-sky-600 px-3 text-xs font-medium text-slate-50 shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;


