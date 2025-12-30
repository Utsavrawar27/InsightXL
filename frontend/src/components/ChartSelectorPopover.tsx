import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  BarChart3,
  PieChart,
  LineChart,
  Radar,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

interface ChartTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  prompt: string;
}

interface ChartSelectorPopoverProps {
  onSelectChart: (prompt: string) => void;
}

const ChartSelectorPopover: React.FC<ChartSelectorPopoverProps> = ({
  onSelectChart,
}) => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const chartTemplates: ChartTemplate[] = [
    // Comparison Charts
    {
      id: "bar",
      name: "Bar Chart",
      icon: <BarChart3 className="h-4 w-4" />,
      category: "Comparison",
      prompt:
        'Create a bar chart with "[Column Name]" on the x-axis and "[Column Name]" on the y-axis.',
    },
    {
      id: "grouped-bar",
      name: "Grouped Bar",
      icon: <BarChart3 className="h-4 w-4" />,
      category: "Comparison",
      prompt:
        'Create a grouped bar chart comparing "[Column 1]" and "[Column 2]" across "[Category Column]".',
    },
    {
      id: "radar",
      name: "Radar Chart",
      icon: <Radar className="h-4 w-4" />,
      category: "Comparison",
      prompt:
        'Create a radar chart showing "[Metrics]" for each "[Category]".',
    },
    // Proportion Charts
    {
      id: "pie",
      name: "Pie Chart",
      icon: <PieChart className="h-4 w-4" />,
      category: "Proportion",
      prompt:
        'Create a pie chart showing the distribution of "[Column Name]".',
    },
    {
      id: "donut",
      name: "Donut Chart",
      icon: <PieChart className="h-4 w-4" />,
      category: "Proportion",
      prompt:
        'Create a donut chart showing the proportion of "[Column Name]" values.',
    },
    // Trend Charts
    {
      id: "line",
      name: "Line Chart",
      icon: <LineChart className="h-4 w-4" />,
      category: "Trend",
      prompt:
        'Create a line chart with "[Time Column]" on x-axis and "[Value Column]" on y-axis to show trends over time.',
    },
    {
      id: "area",
      name: "Area Chart",
      icon: <LineChart className="h-4 w-4" />,
      category: "Trend",
      prompt:
        'Create an area chart showing "[Value Column]" trends over "[Time Column]".',
    },
    // Category Charts
    {
      id: "heatmap",
      name: "Heatmap",
      icon: <LayoutGrid className="h-4 w-4" />,
      category: "Category",
      prompt:
        'Create a heatmap showing the relationship between "[Row Category]" and "[Column Category]" with values from "[Value Column]".',
    },
    {
      id: "treemap",
      name: "Treemap",
      icon: <LayoutGrid className="h-4 w-4" />,
      category: "Category",
      prompt:
        'Create a treemap showing the hierarchical breakdown of "[Category Column]" by "[Value Column]".',
    },
  ];

  const categories = [...new Set(chartTemplates.map((t) => t.category))];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChartSelect = (template: ChartTemplate) => {
    onSelectChart(template.prompt);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 rounded-lg p-2 transition ${
          isDark
            ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        } ${isOpen ? (isDark ? "bg-slate-700" : "bg-slate-100") : ""}`}
        title="Chart Creation"
      >
        <BarChart3 className="h-5 w-5" />
        <ChevronDown className={`h-3 w-3 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div
          className={`absolute bottom-full left-0 z-50 mb-2 w-80 rounded-xl border shadow-xl ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-white"
          }`}
        >
          {/* Header */}
          <div
            className={`border-b px-4 py-3 ${
              isDark ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <h3
              className={`font-semibold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Chart Creation
            </h3>
          </div>

          {/* Chart Options */}
          <div className="max-h-80 overflow-y-auto p-3">
            {categories.map((category) => (
              <div key={category} className="mb-4 last:mb-0">
                <p
                  className={`mb-2 text-xs font-medium uppercase tracking-wide ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {category}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {chartTemplates
                    .filter((t) => t.category === category)
                    .map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleChartSelect(template)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                          isDark
                            ? "text-slate-300 hover:bg-slate-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span
                          className={isDark ? "text-blue-400" : "text-blue-600"}
                        >
                          {template.icon}
                        </span>
                        <span className="truncate">{template.name}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Hint */}
          <div
            className={`border-t px-4 py-2 ${
              isDark ? "border-slate-700" : "border-slate-200"
            }`}
          >
            <p
              className={`text-xs ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Select a chart type to auto-fill the prompt
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartSelectorPopover;

