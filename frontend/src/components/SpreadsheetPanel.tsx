import React from "react";

interface SpreadsheetPanelProps {
  // Placeholder for future rich spreadsheet state
}

const mockHeaders = ["A", "B", "C", "D", "E"];
const mockRows = 12;

const SpreadsheetPanel: React.FC<SpreadsheetPanelProps> = () => {
  return (
    <div className="flex h-full flex-col bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Sheet1</h2>
          <p className="text-xs text-slate-400">
            Lightweight grid preview – later this will sync with real Excel / CSV data.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-sky-500 hover:text-sky-100">
            Upload Excel / CSV
          </button>
          <button className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:border-emerald-500 hover:text-emerald-100">
            Export to Excel
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950 p-4">
        <div className="inline-block rounded-lg border border-slate-800 bg-slate-900 shadow-sm">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-500">
                  #
                </th>
                {mockHeaders.map((h) => (
                  <th
                    key={h}
                    className="min-w-[80px] border-l border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-medium text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: mockRows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-900/70">
                  <td className="sticky left-0 z-10 border-t border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-500">
                    {rowIdx + 1}
                  </td>
                  {mockHeaders.map((h) => (
                    <td
                      key={h}
                      className="min-w-[80px] border-t border-l border-slate-800 px-2 py-1 text-[11px] text-slate-200"
                    >
                      {/* Placeholder cell content */}-
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetPanel;


