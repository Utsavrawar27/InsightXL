import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Lightbulb } from "lucide-react";

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

interface ChartRendererProps {
  chartData: ChartData;
}

// Professional color palette
const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6366F1", // Indigo
];

const ChartRenderer: React.FC<ChartRendererProps> = ({ chartData }) => {
  const { isDark } = useTheme();

  const textColor = isDark ? "#E2E8F0" : "#1E293B";
  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const bgColor = isDark ? "#1E293B" : "#FFFFFF";

  const renderChart = () => {
    const commonProps = {
      data: chartData.data,
    };

    switch (chartData.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: chartData.yAxisLabel || "Value",
                  angle: -90,
                  position: "insideLeft",
                  fill: textColor,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  color: textColor,
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Bar dataKey="value" name={chartData.yAxisLabel || "Value"} radius={[4, 4, 0, 0]}>
                {chartData.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: chartData.yAxisLabel || "Value",
                  angle: -90,
                  position: "insideLeft",
                  fill: textColor,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  color: textColor,
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <Line
                type="monotone"
                dataKey="value"
                name={chartData.yAxisLabel || "Value"}
                stroke={COLORS[0]}
                strokeWidth={3}
                dot={{ fill: COLORS[0], strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={140}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  color: textColor,
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={textColor}
                tick={{ fill: textColor, fontSize: 12 }}
                label={{
                  value: chartData.yAxisLabel || "Value",
                  angle: -90,
                  position: "insideLeft",
                  fill: textColor,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  color: textColor,
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                name={chartData.yAxisLabel || "Value"}
                stroke={COLORS[0]}
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.data}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, "auto"]}
                tick={{ fill: textColor, fontSize: 10 }}
              />
              <Radar
                name={chartData.yAxisLabel || "Value"}
                dataKey="value"
                stroke={COLORS[0]}
                fill={COLORS[0]}
                fillOpacity={0.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: bgColor,
                  border: `1px solid ${gridColor}`,
                  borderRadius: "8px",
                  color: textColor,
                }}
              />
              <Legend wrapperStyle={{ color: textColor }} />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center py-12 text-slate-500">
            Unsupported chart type: {chartData.chartType}
          </div>
        );
    }
  };

  // Calculate statistics for insights
  const values = chartData.data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const maxItem = chartData.data.find((d) => d.value === maxValue);
  const minItem = chartData.data.find((d) => d.value === minValue);

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b px-6 py-4 ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          📊 {chartData.title}
        </h3>
        <p
          className={`mt-1 text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {chartData.description}
        </p>
      </div>

      {/* Chart */}
      <div className="p-4">{renderChart()}</div>

      {/* Quick Stats */}
      <div
        className={`grid grid-cols-3 gap-4 border-t px-6 py-4 ${
          isDark ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span
              className={`text-xs font-medium uppercase ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Highest
            </span>
          </div>
          <p
            className={`mt-1 text-lg font-bold ${
              isDark ? "text-green-400" : "text-green-600"
            }`}
          >
            {typeof maxValue === "number" ? maxValue.toLocaleString() : maxValue}
          </p>
          <p
            className={`text-xs truncate ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {maxItem?.name}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span
              className={`text-xs font-medium uppercase ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Average
            </span>
          </div>
          <p
            className={`mt-1 text-lg font-bold ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {typeof avgValue === "number" ? Math.round(avgValue).toLocaleString() : avgValue}
          </p>
          <p
            className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            across {chartData.data.length} items
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span
              className={`text-xs font-medium uppercase ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Lowest
            </span>
          </div>
          <p
            className={`mt-1 text-lg font-bold ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {typeof minValue === "number" ? minValue.toLocaleString() : minValue}
          </p>
          <p
            className={`text-xs truncate ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {minItem?.name}
          </p>
        </div>
      </div>

      {/* AI Insights */}
      {chartData.insights && chartData.insights.length > 0 && (
        <div
          className={`border-t px-6 py-4 ${
            isDark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb
              className={`h-4 w-4 ${isDark ? "text-amber-400" : "text-amber-500"}`}
            />
            <span
              className={`text-sm font-semibold ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              AI Insights
            </span>
          </div>
          <ul className="space-y-2">
            {chartData.insights.map((insight, index) => (
              <li
                key={index}
                className={`flex items-start gap-2 text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <span className="text-blue-500 mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChartRenderer;

