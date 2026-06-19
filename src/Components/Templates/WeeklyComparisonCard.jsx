import { useMemo } from "react";

const WeeklyComparisonCard = ({ issues = [] }) => {
  const { thisWeek, lastWeek } = useMemo(() => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    let twReported = 0, twResolved = 0, lwReported = 0, lwResolved = 0;

    issues.forEach((issue) => {
      const createdAt = new Date(issue.created_at);
      const status = issue.status?.toLowerCase();

      if (createdAt >= startOfThisWeek) {
        twReported++;
        if (status === "resolved") twResolved++;
      } else if (createdAt >= startOfLastWeek && createdAt < startOfThisWeek) {
        lwReported++;
        if (status === "resolved") lwResolved++;
      }
    });

    return {
      thisWeek: { reported: twReported, resolved: twResolved },
      lastWeek: { reported: lwReported, resolved: lwResolved },
    };
  }, [issues]);

  const getChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const reportedChange = getChange(thisWeek.reported, lastWeek.reported);
  const resolvedChange = getChange(thisWeek.resolved, lastWeek.resolved);

  const StatBlock = ({ label, current, previous, change, isGoodWhenUp }) => {
    const isUp = change > 0;
    const isNeutral = change === 0;
    // For "reported", up is bad (more issues). For "resolved", up is good.
    const isPositive = isGoodWhenUp ? isUp : !isUp;

    return (
      <div className="flex-1 p-4 bg-muted/20 rounded-xl border border-border/50">
        <span className="text-xs text-muted-foreground font-medium block mb-2">
          {label}
        </span>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-extrabold text-card-foreground leading-none">
            {current}
          </span>
          {!isNeutral && (
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              }`}
            >
              <i className={`ri-arrow-${isUp ? "up" : "down"}-s-line text-sm`}></i>
              {Math.abs(change)}%
            </span>
          )}
          {isNeutral && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
              —
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-2 block">
          Last week: <span className="font-semibold text-card-foreground">{previous}</span>
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xs">
      <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
        <i className="ri-arrow-left-right-line text-[#7E70EB] text-lg"></i>
        Weekly Comparison
      </h3>

      <div className="flex gap-3">
        <StatBlock
          label="Reported"
          current={thisWeek.reported}
          previous={lastWeek.reported}
          change={reportedChange}
          isGoodWhenUp={false}
        />
        <StatBlock
          label="Resolved"
          current={thisWeek.resolved}
          previous={lastWeek.resolved}
          change={resolvedChange}
          isGoodWhenUp={true}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 px-1">
        <i className="ri-calendar-line text-muted-foreground text-sm"></i>
        <span className="text-xs text-muted-foreground">
          Comparing Sun–Today vs previous 7 days
        </span>
      </div>
    </div>
  );
};

export default WeeklyComparisonCard;
