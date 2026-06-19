import { useMemo, useState } from "react";

const CATEGORIES = ["maintenance", "cleanliness", "facilities", "security", "infrastructure", "others"];
const PRIORITIES = ["low", "medium", "high", "critical"];

const CATEGORY_LABELS = {
  maintenance: "Maintenance",
  cleanliness: "Cleanliness",
  facilities: "Facilities",
  security: "Security",
  infrastructure: "Infrastructure",
  others: "Others",
};

const PRIORITY_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const CategoryPriorityHeatmap = ({ issues = [] }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const { matrix, maxCount } = useMemo(() => {
    const grid = {};
    let max = 0;

    CATEGORIES.forEach((cat) => {
      grid[cat] = {};
      PRIORITIES.forEach((pri) => {
        grid[cat][pri] = 0;
      });
    });

    issues.forEach((issue) => {
      const cat = issue.main_category?.toLowerCase().trim();
      const pri = issue.priority?.toLowerCase().trim();
      // normalize "new" priority to "low"
      const normalizedPri = pri === "new" ? "low" : pri;

      if (grid[cat] && grid[cat][normalizedPri] !== undefined) {
        grid[cat][normalizedPri]++;
        if (grid[cat][normalizedPri] > max) max = grid[cat][normalizedPri];
      }
    });

    return { matrix: grid, maxCount: max };
  }, [issues]);

  const getOpacity = (count) => {
    if (maxCount === 0 || count === 0) return 0.06;
    return 0.15 + (count / maxCount) * 0.85;
  };

  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xs">
      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <i className="ri-fire-line text-orange-500 text-lg"></i>
        Category × Priority Heatmap
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th className="text-xs text-muted-foreground font-medium text-left pr-3 pb-2"></th>
              {PRIORITIES.map((pri) => (
                <th
                  key={pri}
                  className="text-xs font-semibold text-center pb-2 capitalize"
                  style={{ color: PRIORITY_COLORS[pri] }}
                >
                  {pri}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat}>
                <td className="text-xs text-muted-foreground font-medium pr-3 py-0.5 whitespace-nowrap">
                  {CATEGORY_LABELS[cat]}
                </td>
                {PRIORITIES.map((pri) => {
                  const count = matrix[cat]?.[pri] || 0;
                  const isHovered =
                    hoveredCell?.cat === cat && hoveredCell?.pri === pri;

                  return (
                    <td
                      key={pri}
                      className="relative text-center cursor-default transition-all duration-200"
                      onMouseEnter={() => setHoveredCell({ cat, pri })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-full h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor: PRIORITY_COLORS[pri],
                          opacity: getOpacity(count),
                          transform: isHovered ? "scale(1.08)" : "scale(1)",
                        }}
                      >
                      </div>
                      <span
                        className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-opacity duration-200 ${
                          count > 0 ? "text-card-foreground" : "text-muted-foreground/50"
                        }`}
                      >
                        {count}
                      </span>

                      {/* Tooltip */}
                      {isHovered && count > 0 && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                          {CATEGORY_LABELS[cat]} · {pri}: {count}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-4 justify-center">
        <span className="text-xs text-muted-foreground">Low</span>
        <div className="flex gap-0.5">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
            <div
              key={opacity}
              className="w-5 h-3 rounded-sm"
              style={{ backgroundColor: "#6366f1", opacity }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">High</span>
      </div>
    </div>
  );
};

export default CategoryPriorityHeatmap;
