import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const sections = {
  home: "home",
  features: "features",
  pricing: "pricing",
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top nav */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur ${
          isDark
            ? "border-slate-800/60 bg-slate-950/80"
            : "border-slate-200/80 bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-xs font-bold text-slate-950 shadow-lg shadow-sky-500/40">
              IX
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                InsightXL
              </div>
              <div className="text-[11px] text-slate-400">
                Excel-native AI workspace
              </div>
            </div>
          </div>
          <nav
            className={`hidden items-center gap-4 text-xs font-medium md:flex ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            <button
              onClick={() => scrollTo(sections.home)}
              className="transition hover:text-sky-400"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo(sections.features)}
              className="transition hover:text-sky-400"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo(sections.pricing)}
              className="transition hover:text-sky-400"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium shadow-sm transition ${
                isDark
                  ? "border-slate-600 bg-slate-800 text-slate-200 hover:border-sky-400 hover:text-sky-300"
                  : "border-slate-300 bg-slate-100 text-slate-700 hover:border-sky-400 hover:text-sky-600"
              }`}
            >
              <span>{isDark ? "🌙 Night" : "☀ Day"}</span>
            </button>
            <button
              onClick={onGetStarted}
              className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-sky-500/40 transition hover:bg-sky-400"
            >
              Try InsightXL
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Hero */}
        <section
          id={sections.home}
          className="relative flex flex-col items-center gap-10 py-14 md:py-20"
        >
          {/* Centered hero copy */}
          <div className="relative z-10 max-w-3xl space-y-6 text-center">
            <span
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[12px] font-medium ${
                isDark
                  ? "border-sky-500/30 bg-sky-500/10 text-sky-200"
                  : "border-sky-400/50 bg-sky-100 text-sky-700"
              }`}
            >
              AI-Powered Excel Data Analysis &amp; Visualization
            </span>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Turn messy spreadsheets into{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                clear, actionable insights
              </span>
              .
            </h1>
            <p
              className={`mx-auto max-w-2xl text-sm leading-relaxed md:text-[15px] ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Skip formulas and complex tooling. Upload your Excel or CSV files,
              chat in plain language, and let InsightXL clean your data,
              analyze trends, and build the visuals for you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <button
                onClick={onGetStarted}
                className="rounded-full bg-sky-500 px-6 py-2.5 text-xs font-semibold text-slate-950 shadow-sm shadow-sky-500/40 transition hover:bg-sky-400"
              >
                Start free
              </button>
              <button
                onClick={() => scrollTo(sections.features)}
                className={`rounded-full border px-6 py-2.5 text-xs font-semibold transition ${
                  isDark
                    ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500/70 hover:text-sky-200"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-600"
                }`}
              >
                View features
              </button>
            </div>
            <span
              className={`block text-[11px] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              No complex setup · Works with Excel files you already have
            </span>
          </div>

          {/* Large centered preview below hero */}
          <div className="relative w-full max-w-5xl">
            <div className="pointer-events-none absolute inset-0 -translate-y-10 rounded-[40px] bg-sky-500/10 blur-3xl" />
            <div
              className={`relative overflow-hidden rounded-3xl border shadow-2xl ${
                isDark
                  ? "border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 shadow-slate-950/80"
                  : "border-slate-200 bg-white shadow-slate-300/50"
              }`}
            >
              <div
                className={`flex items-center justify-between border-b px-5 py-3 ${
                  isDark
                    ? "border-slate-800/80 bg-slate-950/80"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isDark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isDark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isDark ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  />
                </div>
                <span
                  className={`text-[13px] font-semibold ${
                    isDark ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  InsightXL · Preview
                </span>
              </div>
              <div className="grid gap-0 md:grid-cols-[5fr_7fr]">
                <div
                  className={`border-r p-4 ${
                    isDark
                      ? "border-slate-800/80 bg-slate-950/80"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`mb-2 text-[12px] font-medium ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Chat with your spreadsheet
                  </p>
                  <div className="space-y-3 text-[11px] leading-relaxed">
                    <div className="flex justify-end">
                      <div className="max-w-[90%] rounded-2xl bg-sky-600 px-3 py-2 text-slate-50">
                        &quot;Clean this sales report and highlight outliers
                        above 30% growth.&quot;
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div
                        className={`max-w-[90%] rounded-2xl border px-3 py-2 ${
                          isDark
                            ? "border-slate-800 bg-slate-900 text-slate-100"
                            : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        I&apos;ve removed duplicates, normalized currency
                        formats, and flagged 7 products with unusually high
                        growth. A comparison chart has been prepared for your
                        review.
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 ${
                    isDark ? "bg-slate-950/60" : "bg-slate-100/40"
                  }`}
                >
                  <p
                    className={`mb-2 text-[12px] font-medium ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Smart grid &amp; visual preview
                  </p>
                  <div className="space-y-3">
                    <div
                      className={`overflow-hidden rounded-xl border ${
                        isDark
                          ? "border-slate-800 bg-slate-900/60"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-[10px]">
                          <thead
                            className={
                              isDark
                                ? "bg-slate-900/80 text-slate-400"
                                : "bg-slate-100 text-slate-600"
                            }
                          >
                            <tr>
                              <th className="px-2 py-1 text-left">Product</th>
                              <th className="px-2 py-1 text-right">Revenue</th>
                              <th className="px-2 py-1 text-right">Growth</th>
                              <th className="px-2 py-1 text-right">Region</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ["Starter", "$24,500", "+8%", "EMEA"],
                              ["Growth", "$81,200", "+27%", "US"],
                              ["Scale", "$132,900", "+34%", "APAC"],
                              ["Enterprise", "$210,400", "+5%", "Global"],
                            ].map((row, idx) => (
                              <tr
                                key={row[0]}
                                className={
                                  idx === 2
                                    ? isDark
                                      ? "bg-emerald-500/10 text-emerald-100"
                                      : "bg-emerald-50 text-emerald-700"
                                    : isDark
                                    ? "text-slate-200"
                                    : "text-slate-700"
                                }
                              >
                                <td
                                  className={`border-t px-2 py-1 ${
                                    isDark ? "border-slate-800" : "border-slate-200"
                                  }`}
                                >
                                  {row[0]}
                                </td>
                                <td
                                  className={`border-t px-2 py-1 text-right ${
                                    isDark ? "border-slate-800" : "border-slate-200"
                                  }`}
                                >
                                  {row[1]}
                                </td>
                                <td
                                  className={`border-t px-2 py-1 text-right ${
                                    isDark ? "border-slate-800" : "border-slate-200"
                                  }`}
                                >
                                  {row[2]}
                                </td>
                                <td
                                  className={`border-t px-2 py-1 text-right ${
                                    isDark ? "border-slate-800" : "border-slate-200"
                                  }`}
                                >
                                  {row[3]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* Line Chart - Full Width */}
                      <div
                        className={`rounded-xl border p-3 ${
                          isDark
                            ? "border-slate-800 bg-slate-900/70"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`text-[11px] font-medium ${
                              isDark ? "text-slate-200" : "text-slate-700"
                            }`}
                          >
                            Sales Performance Trend
                          </span>
                          <span
                            className={`text-[9px] ${
                              isDark ? "text-emerald-300" : "text-emerald-600"
                            }`}
                          >
                            ↑ 24.5% YoY
                          </span>
                        </div>
                        <svg
                          viewBox="0 0 280 70"
                          className="h-16 w-full"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Grid lines */}
                          <line
                            x1="25"
                            y1="10"
                            x2="25"
                            y2="55"
                            stroke={isDark ? "#475569" : "#cbd5e1"}
                            strokeWidth="0.5"
                          />
                          <line
                            x1="25"
                            y1="55"
                            x2="270"
                            y2="55"
                            stroke={isDark ? "#475569" : "#cbd5e1"}
                            strokeWidth="0.5"
                          />
                          {/* Horizontal grid lines */}
                          {[35, 45].map((y) => (
                            <line
                              key={y}
                              x1="25"
                              y1={y}
                              x2="270"
                              y2={y}
                              stroke={isDark ? "#334155" : "#e2e8f0"}
                              strokeWidth="0.3"
                              strokeDasharray="2,2"
                            />
                          ))}
                          {/* Line path */}
                          <polyline
                            points="35,48 65,42 95,45 125,38 155,35 185,30 215,28 245,22"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Data points */}
                          {[
                            { x: 35, y: 48 },
                            { x: 65, y: 42 },
                            { x: 95, y: 45 },
                            { x: 125, y: 38 },
                            { x: 155, y: 35 },
                            { x: 185, y: 30 },
                            { x: 215, y: 28 },
                            { x: 245, y: 22 },
                          ].map((point, i) => (
                            <circle
                              key={i}
                              cx={point.x}
                              cy={point.y}
                              r="2"
                              fill="#3b82f6"
                            />
                          ))}
                          {/* Month labels */}
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                            (month, i) => (
                              <text
                                key={month}
                                x={35 + i * 30}
                                y="63"
                                fontSize="6"
                                fill={isDark ? "#94a3b8" : "#64748b"}
                                textAnchor="middle"
                              >
                                {month}
                              </text>
                            )
                          )}
                        </svg>
                      </div>

                      {/* Bar Chart & Pie Chart Row */}
                      <div className="grid gap-3 md:grid-cols-2">
                        {/* Bar Chart */}
                        <div
                          className={`rounded-xl border p-3 ${
                            isDark
                              ? "border-slate-800 bg-slate-900/70"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className={`text-[11px] font-medium ${
                                isDark ? "text-slate-200" : "text-slate-700"
                              }`}
                            >
                              Quarterly Revenue
                            </span>
                            <span
                              className={`text-[9px] ${
                                isDark ? "text-emerald-300" : "text-emerald-600"
                              }`}
                            >
                              +18% QoQ
                            </span>
                          </div>
                          <svg
                            viewBox="0 0 200 80"
                            className="h-20 w-full"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Grid lines */}
                            <line
                              x1="20"
                              y1="10"
                              x2="20"
                              y2="60"
                              stroke={isDark ? "#475569" : "#cbd5e1"}
                              strokeWidth="0.5"
                            />
                            <line
                              x1="20"
                              y1="60"
                              x2="190"
                              y2="60"
                              stroke={isDark ? "#475569" : "#cbd5e1"}
                              strokeWidth="0.5"
                            />
                            {/* Horizontal grid lines */}
                            {[30, 45].map((y) => (
                              <line
                                key={y}
                                x1="20"
                                y1={y}
                                x2="190"
                                y2={y}
                                stroke={isDark ? "#334155" : "#e2e8f0"}
                                strokeWidth="0.3"
                                strokeDasharray="2,2"
                              />
                            ))}
                            {/* Bars */}
                            {[
                              { x: 30, h: 20, label: "Q1" },
                              { x: 60, h: 28, label: "Q2" },
                              { x: 90, h: 38, label: "Q3" },
                              { x: 120, h: 45, label: "Q4" },
                              { x: 150, h: 52, label: "Q1'24" },
                            ].map((bar, i) => (
                              <g key={i}>
                                <rect
                                  x={bar.x}
                                  y={60 - bar.h}
                                  width="18"
                                  height={bar.h}
                                  fill={
                                    i === 4
                                      ? "#10b981"
                                      : isDark
                                      ? "#3b82f6"
                                      : "#0ea5e9"
                                  }
                                  rx="1"
                                />
                                <text
                                  x={bar.x + 9}
                                  y="70"
                                  fontSize="6"
                                  fill={isDark ? "#94a3b8" : "#64748b"}
                                  textAnchor="middle"
                                >
                                  {bar.label}
                                </text>
                              </g>
                            ))}
                          </svg>
                        </div>

                        {/* Pie Chart */}
                        <div
                          className={`rounded-xl border p-3 ${
                            isDark
                              ? "border-slate-800 bg-slate-900/70"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className={`text-[11px] font-medium ${
                                isDark ? "text-slate-200" : "text-slate-700"
                              }`}
                            >
                              Market Share
                            </span>
                            <span
                              className={`text-[9px] ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              By region
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg
                              viewBox="0 0 40 40"
                              className="h-16 w-16"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke={isDark ? "#1e293b" : "#f1f5f9"}
                                strokeWidth="8"
                              />
                              {/* APAC - 45% */}
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="8"
                                strokeDasharray="45 55"
                                strokeDashoffset="25"
                                transform="rotate(-90 20 20)"
                              />
                              {/* US - 35% */}
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="8"
                                strokeDasharray="35 65"
                                strokeDashoffset="-20"
                                transform="rotate(-90 20 20)"
                              />
                              {/* EMEA - 20% */}
                              <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="8"
                                strokeDasharray="20 80"
                                strokeDashoffset="-55"
                                transform="rotate(-90 20 20)"
                              />
                            </svg>
                            <div className="flex flex-col gap-1.5">
                              {[
                                { label: "APAC", value: "45%", color: "#10b981" },
                                { label: "US", value: "35%", color: "#3b82f6" },
                                { label: "EMEA", value: "20%", color: "#8b5cf6" },
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  className="flex items-center gap-2"
                                >
                                  <span
                                    className="h-2 w-2 rounded-sm"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span
                                    className={`text-[10px] ${
                                      isDark ? "text-slate-300" : "text-slate-600"
                                    }`}
                                  >
                                    {item.label} {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* We can help you resolve it */}
        <section
          className={`border-y py-12 md:py-16 ${
            isDark ? "border-slate-800/60 bg-slate-950/60" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-3 text-2xl font-semibold tracking-tight md:text-3xl">
              We can help you resolve it.
            </h2>
            <p
              className={`mx-auto max-w-2xl text-sm md:text-[15px] ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Whether you&apos;re drowning in Excel tabs or wrestling with
              messy CSV exports, InsightXL turns raw data into clean,
              explainable views your team can actually act on.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              {
                icon: "∑",
                title: "Overwhelmed by spreadsheets",
                body: "Multiple sheets, odd formats, and broken formulas—untangled automatically.",
              },
              {
                icon: "📊",
                title: "Confusing metrics",
                body: "Turn statistical jargon into plain-language explanations and KPIs.",
              },
              {
                icon: "⏱",
                title: "Hours lost on charts",
                body: "Get publish-ready visuals in seconds instead of wrestling with chart options.",
              },
              {
                icon: "🎯",
                title: "Hidden insights",
                body: "Surface trends, anomalies, and opportunities you might otherwise miss.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl p-4 text-left shadow-sm ${
                  isDark
                    ? "border border-slate-800 bg-slate-950/80 shadow-slate-950/40"
                    : "border border-slate-200 bg-white shadow-slate-200/80"
                }`}
              >
                <div
                  className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl text-sm ${
                    isDark ? "bg-sky-500/15" : "bg-sky-100"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                </div>
                <h3
                  className={`mb-1 text-sm font-semibold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Core features */}
        <section
          id={sections.features}
          className="space-y-8 py-12 md:py-16"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Our core features
            </h2>
            <p
              className={`mx-auto mt-2 max-w-2xl text-sm md:text-[15px] ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              InsightXL sits where Excel power users and AI agents meet—built
              for analysts, operators, and business teams who live in
              spreadsheets.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                label: "Spreadsheet Assistant",
                headline: "Automate tedious spreadsheet work.",
                points: [
                  "Clean duplicates, standardize formats, and fix obvious errors in one request.",
                  "Apply consistent rules across multiple sheets and workbooks.",
                  "Document every change so you always know what was modified.",
                ],
              },
              {
                label: "AI Data Analysis",
                headline: "Ask data questions in plain English.",
                points: [
                  "Run descriptive stats, breakdowns, and comparisons without formulas.",
                  "Translate complex metrics into language everyone understands.",
                  "Quickly test hypotheses like “Which region is dragging margin down?”.",
                ],
              },
              {
                label: "AI Data Visualization",
                headline: "One-click, presentation-ready charts.",
                points: [
                  "Generate line, bar, and combo charts from a simple prompt.",
                  "Smart chart suggestions based on the data you select.",
                  "Export visuals to use in slides, docs, or dashboards.",
                ],
              },
              {
                label: "AI Business Intelligence",
                headline: "From raw rows to decision-ready views.",
                points: [
                  "Summarize performance by product, segment, or channel.",
                  "Spot anomalies and outliers before they become issues.",
                  "Get narrative summaries you can paste directly into reports.",
                ],
              },
              {
                label: "Image / PDF to Excel",
                headline: "Turn static tables into live spreadsheets.",
                points: [
                  "Upload table screenshots or PDFs and get editable tables back.",
                  "Preserve structure, headers, and types wherever possible.",
                  "Combine imported data with existing models and reports.",
                ],
              },
              {
                label: "Spreadsheet Generator",
                headline: "Design templates with natural language.",
                points: [
                  "Describe the process you track; get a tailored spreadsheet layout.",
                  "Pre-populate useful formulas, validations, and conditional formats.",
                  "Save templates to reuse across teams and projects.",
                ],
              },
            ].map((card) => (
              <div
                key={card.label}
                className={`flex flex-col gap-3 rounded-2xl p-5 shadow-sm ${
                  isDark
                    ? "border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 shadow-slate-950/40"
                    : "border border-slate-200 bg-white shadow-slate-200/70"
                }`}
              >
                <span
                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-medium ${
                    isDark
                      ? "border-sky-500/40 bg-sky-500/10 text-sky-200"
                      : "border-sky-400/60 bg-sky-50 text-sky-700"
                  }`}
                >
                  {card.label}
                </span>
                <h3
                  className={`text-sm font-semibold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  {card.headline}
                </h3>
                <ul
                  className={`space-y-1.5 text-xs ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {card.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          className={`space-y-8 border-y py-12 md:py-16 ${
            isDark ? "border-slate-800/60 bg-slate-950/60" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              How InsightXL works
            </h2>
            <p
              className={`mx-auto mt-2 max-w-2xl text-sm md:text-[15px] ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              A simple three-step flow designed for non-technical users—but
              powerful enough for data teams.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload your Excel or CSV",
                body: "Drop in your existing reports, exports, or ad-hoc spreadsheets. InsightXL understands .xlsx and .csv out of the box.",
              },
              {
                step: "2",
                title: "Ask questions naturally",
                body: "Describe what you need—“compare regions”, “forecast next quarter”, or “find anomalies”—and let the AI drive the analysis.",
              },
              {
                step: "3",
                title: "Get instant insights & visuals",
                body: "Review clean tables, charts, and narrative summaries you can plug straight into decks, docs, or emails.",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className={`relative overflow-hidden rounded-2xl p-5 shadow-sm ${
                  isDark
                    ? "border border-slate-800 bg-slate-950/80 shadow-slate-950/40"
                    : "border border-slate-200 bg-white shadow-slate-200/80"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />
                <div
                  className={`mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                    isDark
                      ? "bg-sky-500/15 text-sky-200"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {item.step}
                </div>
                <h3
                  className={`mb-2 text-sm font-semibold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {item.body}
                </p>
                {idx === 0 && (
                  <div
                    className={`mt-4 rounded-lg border border-dashed px-3 py-2 text-[11px] ${
                      isDark
                        ? "border-slate-700 bg-slate-900/60 text-slate-300"
                        : "border-slate-300 bg-slate-100 text-slate-600"
                    }`}
                  >
                    Drag in Excel exports from tools like Stripe, HubSpot, or
                    your CRM—no custom integrations required.
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section
          id={sections.pricing}
          className="space-y-8 py-12 md:py-16"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Pricing that grows with your analysis
            </h2>
            <p
              className={`mx-auto mt-2 max-w-2xl text-sm md:text-[15px] ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Start free, upgrade only when spreadsheets become central to your
              workflow. All plans include secure file handling and GPT-4o
              powered analysis.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$0",
                cadence: "forever",
                highlight: "Best for trying InsightXL on a few files.",
                features: [
                  "Up to 3 workbooks / month",
                  "Basic cleaning & summary insights",
                  "Standard charts (line, bar, pie)",
                  "Email support",
                ],
                featured: false,
              },
              {
                name: "Pro",
                price: "$19",
                cadence: "per user / month",
                highlight: "For operators and analysts who live in Excel.",
                features: [
                  "Unlimited chat with your spreadsheets",
                  "Priority processing & richer charts",
                  "Image / PDF to Excel conversions",
                  "Team-ready templates and exports",
                ],
                featured: true,
              },
              {
                name: "Teams",
                price: "Let’s talk",
                cadence: "",
                highlight: "For finance, ops, and data teams that need scale.",
                features: [
                  "Centralized workspace & governance",
                  "Custom models and retention policies",
                  "Dedicated success & onboarding",
                  "Optional self-hosted deployment",
                ],
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-5 shadow-sm ${
                  plan.featured
                    ? isDark
                      ? "border-sky-500/60 bg-gradient-to-b from-sky-500/15 via-slate-950 to-slate-950 shadow-slate-950/40"
                      : "border-sky-400/60 bg-gradient-to-b from-sky-100 via-white to-slate-50 shadow-slate-200/80"
                    : isDark
                    ? "border-slate-800 bg-slate-950/80 shadow-slate-950/40"
                    : "border-slate-200 bg-white shadow-slate-200/80"
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-semibold ${
                        isDark ? "text-slate-50" : "text-slate-900"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    {plan.featured && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          isDark
                            ? "bg-sky-500/20 text-sky-200"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        Most popular
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1 text-[11px] ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {plan.highlight}
                  </p>
                </div>
                <div className="mb-4 flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-semibold ${
                      isDark ? "text-slate-50" : "text-slate-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.cadence && (
                    <span
                      className={`text-[11px] ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {plan.cadence}
                    </span>
                  )}
                </div>
                <ul
                  className={`mb-5 space-y-1.5 text-xs ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (plan.name === "Starter") {
                      onGetStarted();
                    }
                  }}
                  className={`mt-auto rounded-full px-4 py-2 text-xs font-semibold transition ${
                    plan.featured
                      ? "bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/40 hover:bg-sky-400"
                      : isDark
                      ? "border border-slate-700 bg-slate-900 text-slate-100 hover:border-sky-500/70 hover:text-sky-100"
                      : "border border-slate-300 bg-slate-50 text-slate-700 hover:border-sky-500/70 hover:bg-slate-100"
                  }`}
                >
                  {plan.name === "Starter" ? "Get started" : "Talk to us"}
                </button>
              </div>
            ))}
          </div>
          <p
            className={`mt-4 text-center text-[11px] ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Need something custom or on-premise? Reach out and we&apos;ll help
            you design the right deployment for your data.
          </p>
        </section>

        <footer
          className={`py-8 text-center text-[11px] ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          © {new Date().getFullYear()} InsightXL. Built for people who think in
          rows and columns.
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;


