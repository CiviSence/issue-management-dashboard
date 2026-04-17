import React from 'react';
import { statusStyles, priorityStyles, categoryStyles, profileStyles } from '../../Utils/badgeStyles';

/**
 * A reusable badge component for Status, Priority, and Category tags.
 * 
 * @param {string} type - The type of badge ('status', 'priority', or 'category').
 * @param {string} value - The value to display (e.g., 'resolved', 'high').
 * @param {string} className - Optional additional styles.
 * @param {boolean} showDot - Whether to show the leading dot (default: true).
 */
const StatusBadge = ({ type, value, className = '', showDot = true }) => {
  const stylesMap = {
    status: statusStyles,
    priority: priorityStyles,
    category: categoryStyles,
    profile: profileStyles,
  };

  const currentMap = stylesMap[type] || {};
  const normalizedValue = value?.toLowerCase();
  const style = currentMap[normalizedValue] || currentMap.other || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-500",
    label: value || "Unknown",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm transition-all duration-200
        ${style.bg} ${style.text} ${style.border} ${className}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      )}
      {style.label || value}
    </span>
  );
};

export default StatusBadge;
