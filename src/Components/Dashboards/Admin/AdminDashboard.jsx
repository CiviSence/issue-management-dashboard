import { Suspense, lazy, useEffect, useState } from "react";
import SideNav from "./AdminSideNav";
import TopBar from "../../Templates/TopBar";
import IssueCard from "../../Templates/IssueCard";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import PullToRefresh from "../../Templates/PullToRefresh";
import { useIssues } from "../../../Context/IssueContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { getAssignmentStats } from "../../../Utils/staffissues";

const PieChartCard = lazy(() => import("../../Templates/PieChartCard"));
const BarChartCard = lazy(() => import("../../Templates/BarChartCard"));
const LineChartCard = lazy(() => import("../../Templates/LineChartCard"));
const StatusChart = lazy(() => import("../../Templates/StatusChart"));
const ResolutionRateCard = lazy(
  () => import("../../Templates/ResolutionRateCard"),
);
const WeeklyComparisonCard = lazy(
  () => import("../../Templates/WeeklyComparisonCard"),
);
const IssueAgingCard = lazy(() => import("../../Templates/IssueAgingCard"));
const CategoryPriorityHeatmap = lazy(
  () => import("../../Templates/CategoryPriorityHeatmap"),
);
const RecentActivityCard = lazy(
  () => import("../../Templates/RecentActivityCard"),
);

const CardSkeleton = () => (
  <div className="w-full sm:w-[48%] lg:w-[35%] xl:w-[24%]">
    <Skeleton height={112} borderRadius={12} />
  </div>
);

const ChartSkeleton = ({ height = 260 }) => (
  <Skeleton height={height} borderRadius={12} className="w-full" />
);

const UserSectionSkeleton = () => (
  <div className="bg-[#F0EEFF] p-4 mt-1 rounded-2xl">
    <Skeleton height={200} borderRadius={12} />
  </div>
);

const AdminDashboard = () => {
  const {
    allstats,
    issues = [],
    loadingIssues,
    loadingStats,
    fetchIssues,
    fetchStats,
  } = useIssues();
  const [statsData, setStatsData] = useState({});
  const [loadingStatsData, setLoadingStatsData] = useState(true);

  const fetchAssignmentStats = async () => {
    try {
      const data = await getAssignmentStats();
      setStatsData(data);
    } catch (err) {
      console.error("Failed to fetch assignment stats:", err);
    } finally {
      setLoadingStatsData(false);
    }
  };

  useEffect(() => {
    fetchAssignmentStats();
  }, []);

  const handleRefresh = async () => {
    try {
      await Promise.all([
        fetchIssues ? fetchIssues() : Promise.resolve(),
        fetchStats ? fetchStats() : Promise.resolve(),
        fetchAssignmentStats(),
      ]);
    } catch (err) {
      console.error("Dashboard refresh failed:", err);
    }
  };

  const initialStats = {
    category: {
      maintenance: 0,
      cleanliness: 0,
      facilities: 0,
      security: 0,
      infrastructure: 0,
      others: 0,
    },
    priority: { new: 0, low: 0, medium: 0, high: 0, critical: 0 },
    location: {
      boysHostel: 0,
      girlsHostel: 0,
      campus: 0,
      adminBuilding: 0,
      others: 0,
    },
  };

  const stats = issues.reduce((acc, issue) => {
    const category = issue.main_category?.toLowerCase().trim();
    const priority = issue.priority?.toLowerCase().trim();
    const location = issue.location_building?.toLowerCase().trim();

    if (category && acc.category[category] !== undefined)
      acc.category[category] += 1;
    if (priority && acc.priority[priority] !== undefined)
      acc.priority[priority] += 1;
    if (location === "boys-hostel") acc.location.boysHostel += 1;
    if (location === "girls-hostel") acc.location.girlsHostel += 1;
    if (location === "campus") acc.location.campus += 1;
    if (location === "admin-building") acc.location.adminBuilding += 1;
    if (location === "others") acc.location.others += 1;

    return acc;
  }, initialStats);

  const { category, priority, location } = stats;

  // Status cards data
  const statusCards = [
    {
      name: "Total Issues",
      count: allstats?.issues?.total || 0,
      description: "All reported issues",
      color: "from-[#6366f1] to-[#8b5cf6]",
      color2: "bg-[#6366f1]",
      link: "/reported-issues",
      icon: "ri-alarm-warning-line",
    },
    {
      name: "Pending Issues",
      count: allstats?.issues?.by_status?.new || 0,
      description: "New & Pending",
      color: "from-[#f59e0b] to-[#fbbf24]",
      color2: "bg-[#f59e0b]",
      link: "/pending-issues",
      icon: "ri-time-line",
    },
    {
      name: "In Progress",
      count: allstats?.issues?.by_status?.in_progress || 0,
      description: "Assigned & In Progress",
      color: "from-[#3b82f6] to-[#60a5fa]",
      color2: "bg-[#3b82f6]",
      link: "/in-progress",
      icon: "ri-loader-4-line",
    },
    {
      name: "Resolved Issues",
      count: allstats?.issues?.by_status?.resolved || 0,
      description: "Issues Fixed",
      color: "from-[#10b981] to-[#34d399]",
      color2: "bg-[#10b981]",
      link: "/resolved-issues",
      icon: "ri-checkbox-circle-line",
    },
  ];

  // Chart data
  const pieChartData = [
    { name: "Maintenance", value: category.maintenance, color: "#3b5bdb" },
    { name: "Cleanliness", value: category.cleanliness, color: "#40c057" },
    { name: "Security", value: category.security, color: "#fa5252" },
    { name: "Facilities", value: category.facilities, color: "#fab005" },
    {
      name: "Infrastructure",
      value: category.infrastructure,
      color: "#6c757d",
    },
    {
      name: "Other",
      value: category.others,
      color: "#6594f2",
    },
  ];

  const barChartData = [
    { status: "Low", count: priority.low + priority.new },
    { status: "Medium", count: priority.medium },
    { status: "High", count: priority.high },
    { status: "Critical", count: priority.critical },
  ];

  const locationData = [
    { name: "Admin Building", value: location.adminBuilding, color: "#F6DE4B" },
    { name: "Campus", value: location.campus, color: "#40c057" },
    { name: "Boys Hostel", value: location.boysHostel, color: "#3086D5" },
    { name: "Girls Hostel", value: location.girlsHostel, color: "#E34A4D" },
    { name: "Others", value: location.others, color: "#E34A4D" },
  ];

  const hasIssues = issues.length > 0;

  return (
    <>
      <SideNav />
      <BottomNav />

      <div
        className="w-full lg:w-[calc(100vw-15vw)] bg-[#F8F9FF] overflow-x-hidden overflow-y-auto h-screen pb-20"
        id="adminDashboardScroll"
      >
        <TopBar title="Main Dashboard" />
        <PullToRefresh
          scrollContainerId="adminDashboardScroll"
          onRefresh={handleRefresh}
        >
          <div className="p-2 lg:p-4 w-full">
            {/* ========== 1. STATUS CARDS — Instant overview ========== */}
            <div className="w-full md:mt-4 gap-1.5 sm:gap-2 md:gap-3 flex flex-wrap justify-center md:bg-[#F3F1FF] p-2 sm:p-2 md:p-3 lg:p-4 rounded-2xl ">
              {loadingStats ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
                  {statusCards.map((item, index) => (
                    <IssueCard key={index} issue={item} />
                  ))}
                </>
              )}
            </div>

            {/* ========== 5. DETAILED BREAKDOWN — Priority + Category + Location ========== */}
            {/* <h1 className="md:pt-4 pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#363434]">
          Issue Breakdown
        </h1> */}

            <div className="md:bg-[#F3F1FF] p-2 sm:p-2 md:p-3 lg:p-4 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {loadingIssues ? (
                  <>
                    <ChartSkeleton />
                    <ChartSkeleton />
                    <ChartSkeleton />
                  </>
                ) : (
                  <>
                    <Suspense fallback={<ChartSkeleton />}>
                      <BarChartCard data={barChartData} />
                    </Suspense>

                    <Suspense fallback={<ChartSkeleton />}>
                      <PieChartCard data={pieChartData} />
                    </Suspense>

                    <Suspense fallback={<ChartSkeleton />}>
                      <StatusChart data={locationData} />
                    </Suspense>
                  </>
                )}
              </div>

              {/* Heatmap — full-width below breakdowns */}
              <div className="mt-3">
                {loadingIssues ? (
                  <ChartSkeleton height={280} />
                ) : (
                  <Suspense fallback={<ChartSkeleton height={280} />}>
                    <CategoryPriorityHeatmap issues={issues} />
                  </Suspense>
                )}
              </div>
            </div>

            {/* ========== 2. HEALTH PULSE — Resolution rate + Weekly comparison ========== */}
            {/* <h1 className="md:pt-4 pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#363434]">
          Health Pulse
        </h1> */}

            <div className="md:bg-[#F3F1FF] p-2 sm:p-2 md:p-3 lg:p-4 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {loadingIssues || loadingStats ? (
                  <>
                    <ChartSkeleton height={280} />
                    <ChartSkeleton height={280} />
                  </>
                ) : (
                  <>
                    <Suspense fallback={<ChartSkeleton height={280} />}>
                      <ResolutionRateCard
                        resolved={allstats?.issues?.by_status?.resolved || 0}
                        total={allstats?.issues?.total || 0}
                      />
                    </Suspense>

                    <Suspense fallback={<ChartSkeleton height={280} />}>
                      <WeeklyComparisonCard issues={issues} />
                    </Suspense>
                  </>
                )}
              </div>
            </div>

            {/* ========== 3. URGENT ACTIONS — Aging + Recent activity ========== */}
            {/* <h1 className="md:pt-4 pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#363434]">
          Needs Attention
        </h1> */}

            <div className="md:bg-[#F3F1FF] p-2 sm:p-2 md:p-3 lg:p-4 rounded-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                {loadingIssues ? (
                  <>
                    <div className="lg:col-span-2">
                      <ChartSkeleton height={340} />
                    </div>
                    <div className="lg:col-span-3">
                      <ChartSkeleton height={340} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-2">
                      <Suspense fallback={<ChartSkeleton height={340} />}>
                        <IssueAgingCard issues={issues} />
                      </Suspense>
                    </div>

                    <div className="lg:col-span-3">
                      <Suspense fallback={<ChartSkeleton height={340} />}>
                        <RecentActivityCard issues={issues} />
                      </Suspense>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ========== 4. TRENDS — Full-width line chart ========== */}
            {/* <h1 className="md:pt-4 pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#363434]">
          Issue Trends
        </h1> */}

            <div className="md:bg-[#F3F1FF] p-2 sm:p-2 md:p-3 lg:p-4 rounded-2xl">
              {loadingIssues ? (
                <ChartSkeleton height={280} />
              ) : (
                <Suspense fallback={<ChartSkeleton height={280} />}>
                  <LineChartCard />
                </Suspense>
              )}
            </div>

            {/* ========== 6. OPERATIONS — Assignment stats + Performance metrics ========== */}
            {/* <h1 className="md:pt-4 pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#363434]">
          Operations & Performance
        </h1> */}

            {loadingStatsData ? (
              <div className="w-full p-2 sm:p-2 md:p-3 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-6 md:bg-[#F3F1FF] rounded-2xl ">
                <Skeleton height={200} borderRadius={16} />
                <Skeleton height={200} borderRadius={16} />
              </div>
            ) : (
              <div className="w-full p-2 sm:p-2 md:p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-6 md:bg-[#F3F1FF] rounded-2xl ">
                {/* Left: Overall Assignment Counts */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
                  <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <i className="ri-bar-chart-box-line text-[#7E70EB] text-lg"></i>{" "}
                    Overall Assignment Counts
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground block font-medium">
                        Total Assignments
                      </span>
                      <span className="text-xl font-bold text-card-foreground mt-1 block">
                        {statsData.total_assignments ?? 0}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground block font-medium">
                        Pending
                      </span>
                      <span className="text-xl font-bold text-card-foreground mt-1 block">
                        {statsData.pending_assignments ?? 0}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground block font-medium">
                        Accepted
                      </span>
                      <span className="text-xl font-bold text-card-foreground mt-1 block">
                        {statsData.accepted_assignments ?? 0}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground block font-medium">
                        Rejected
                      </span>
                      <span className="text-xl font-bold text-card-foreground mt-1 block">
                        {statsData.rejected_assignments ?? 0}
                      </span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                      <span className="text-xs text-muted-foreground block font-medium">
                        Completed
                      </span>
                      <span className="text-xl font-bold text-card-foreground mt-1 block">
                        {statsData.completed_assignments ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Performance & Efficiency Metrics */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
                  <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <i className="ri-pulse-line text-emerald-500 text-lg"></i>{" "}
                    Performance & Efficiency Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                        <i className="ri-percent-line text-lg"></i>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">
                          Acceptance Rate
                        </span>
                        <span className="text-lg font-bold text-card-foreground mt-0.5 block">
                          {statsData.acceptance_rate !== undefined
                            ? `${Number(statsData.acceptance_rate).toFixed(1)}%`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#6366f1]/5 rounded-xl border border-[#6366f1]/10 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1] shrink-0">
                        <i className="ri-check-double-line text-lg"></i>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">
                          Completion Rate
                        </span>
                        <span className="text-lg font-bold text-card-foreground mt-0.5 block">
                          {statsData.completion_rate !== undefined
                            ? `${Number(statsData.completion_rate).toFixed(1)}%`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                        <i className="ri-speed-up-line text-lg"></i>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">
                          Avg Response
                        </span>
                        <span className="text-lg font-bold text-card-foreground mt-0.5 block">
                          {statsData.avg_response_time_hours !== undefined
                            ? `${Number(statsData.avg_response_time_hours).toFixed(1)} hrs`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
                        <i className="ri-time-line text-lg"></i>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block font-medium">
                          Avg Completion
                        </span>
                        <span className="text-lg font-bold text-card-foreground mt-0.5 block">
                          {statsData.avg_completion_time_hours !== undefined
                            ? `${Number(statsData.avg_completion_time_hours).toFixed(1)} hrs`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========== 7. TOP REPORTERS — Community ========== */}
            <h1 className="md:pt-4 pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-[#363434]">
              Top Reporters
            </h1>

            <div className="w-full md:mt-2 gap-1 sm:gap-2 md:gap-3 flex flex-wrap  md:bg-[#F3F1FF] p-2 sm:p-2 md:p-3 lg:p-4 rounded-2xl">
              {loadingStats ? <UserSectionSkeleton /> : <UserCard limit={3} />}

              <div className="flex justify-end mt-3">
                <Link
                  to="/leaderboard"
                  className="text-xs lg:text-sm font-bold text-[#7E70EB] hover:text-[#5A50A6] hover:underline transition-all"
                >
                  View Full Leaderboard →
                </Link>
              </div>
            </div>
          </div>
        </PullToRefresh>
      </div>
    </>
  );
};

export default AdminDashboard;
