import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PRIORITY_STYLES = {
  critical: { bg: "bg-rose-500/10", text: "text-rose-600", dot: "bg-rose-500" },
  high: { bg: "bg-orange-500/10", text: "text-orange-600", dot: "bg-orange-500" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  low: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  new: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
};

const STATUS_ICONS = {
  new: "ri-add-circle-line",
  in_progress: "ri-loader-4-line",
  resolved: "ri-checkbox-circle-line",
  assigned: "ri-user-follow-line",
  closed: "ri-close-circle-line",
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
};

const RecentActivityCard = ({ issues = [] }) => {
  const recentIssues = useMemo(() => {
    return [...issues]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  }, [issues]);

  if (recentIssues.length === 0) {
    return (
      <div className="bg-white border border-border p-5 rounded-2xl shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <i className="ri-time-line text-[#7E70EB] text-lg"></i>
          Recent Activity
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <i className="ri-inbox-line text-3xl mb-2"></i>
          <span className="text-sm">No recent activity</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <i className="ri-time-line text-[#7E70EB] text-lg"></i>
          Recent Activity
        </h3>
        <Link
          to="/reported-issues"
          className="text-xs font-bold text-[#6366f1] hover:text-[#5445c9] hover:underline transition-all"
        >
          View All →
        </Link>
      </div>

      <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
        {recentIssues.map((issue, index) => {
          const priority = issue.priority?.toLowerCase() || "low";
          const status = issue.status?.toLowerCase() || "new";
          const pStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.low;
          const statusIcon = STATUS_ICONS[status] || STATUS_ICONS.new;

          return (
            <motion.div
              key={issue.issue_id || issue.id || index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group cursor-default"
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${pStyle.dot} ring-2 ring-white shadow-sm`}></div>
                {index < recentIssues.length - 1 && (
                  <div className="w-px h-6 bg-border/60"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <i className={`${statusIcon} text-sm text-muted-foreground`}></i>
                  <span className="text-sm font-semibold text-card-foreground truncate">
                    {issue.title || issue.description?.slice(0, 50) || "Untitled Issue"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground capitalize">
                    {issue.main_category || "General"}
                  </span>
                  {issue.location_building && (
                    <>
                      <span className="text-xs text-border">·</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {issue.location_building.replace(/-/g, " ")}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md capitalize ${pStyle.bg} ${pStyle.text}`}
                >
                  {priority}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {timeAgo(issue.created_at)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityCard;
