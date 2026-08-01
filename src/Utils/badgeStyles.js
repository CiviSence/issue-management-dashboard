// badge styles for status, priority, and category

export const statusStyles = {
  new: {
    bg: "bg-indigo-50 dark:bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-500/30",
    dot: "bg-indigo-500",
    label: "New",
  },
  acknowledged: {
    bg: "bg-blue-50 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
    label: "Acknowledged",
  },
  in_progress: {
    bg: "bg-amber-50 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
    label: "In Progress",
  },
  resolved: {
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Resolved",
  },
  closed: {
    bg: "bg-gray-100 dark:bg-dark-elevated",
    text: "text-gray-600 dark:text-dark-text-secondary",
    border: "border-gray-200 dark:border-dark-border",
    dot: "bg-gray-500",
    label: "Closed",
  },
  spam: {
    bg: "bg-orange-50 dark:bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-500/30",
    dot: "bg-orange-500",
    label: "Spam",
  },
  pending: {
    bg: "bg-yellow-50 dark:bg-yellow-500/15",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-500/30",
    dot: "bg-yellow-500",
    label: "Pending",
  },
  accepted: {
    bg: "bg-blue-50 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
    label: "Accepted",
  },
  rejected: {
    bg: "bg-red-50 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/30",
    dot: "bg-red-500",
    label: "Rejected",
  },
};

export const priorityStyles = {
  low: {
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Low",
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
    label: "Medium",
  },
  high: {
    bg: "bg-orange-50 dark:bg-orange-500/15",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-500/30",
    dot: "bg-orange-600",
    label: "High",
  },
  critical: {
    bg: "bg-red-50 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/30",
    dot: "bg-red-500 animate-pulse",
    label: "Critical",
  },
};

export const categoryStyles = {
  security: {
    bg: "bg-indigo-50 dark:bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-500/30",
    dot: "bg-indigo-500",
    label: "Security",
  },
  maintenance: {
    bg: "bg-red-50 dark:bg-red-500/15",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-100 dark:border-red-500/30",
    dot: "bg-red-500",
    label: "Maintenance",
  },
  infrastructure: {
    bg: "bg-amber-50 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-500/30",
    dot: "bg-amber-500",
    label: "Infrastructure",
  },
  cleanliness: {
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Cleanliness",
  },
  facilities: {
    bg: "bg-purple-50 dark:bg-purple-500/15",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-500/30",
    dot: "bg-purple-500",
    label: "Facilities",
  },
  other: {
    bg: "bg-gray-50 dark:bg-dark-elevated",
    text: "text-gray-700 dark:text-dark-text-secondary",
    border: "border-gray-200 dark:border-dark-border",
    dot: "bg-gray-500",
    label: "Other",
  },
};

export const profileStyles = {
  verified: {
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Verified",
  },
  unverified: {
    bg: "bg-amber-50 dark:bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/30",
    dot: "bg-amber-500",
    label: "Unverified",
  },
  student: {
    bg: "bg-violet-50 dark:bg-violet-500/15",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-500/30",
    dot: "bg-violet-500",
    label: "Student",
  },
  admin: {
    bg: "bg-indigo-50 dark:bg-indigo-500/15",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-500/30",
    dot: "bg-indigo-500",
    label: "Admin",
  },
  staff: {
    bg: "bg-blue-50 dark:bg-blue-500/15",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
    label: "Staff",
  },
};

