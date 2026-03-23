import { Suspense, lazy } from "react";
import SideNav from "./AdminSideNav";
import Searchbar from "../../Templates/Searchbar";
import IssueCard from "../../Templates/IssueCard";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import { useIssues } from "../../../Context/IssueContext.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const PieChartCard = lazy(() => import("../../Templates/PieChartCard"));
const BarChartCard = lazy(() => import("../../Templates/BarChartCard"));
const LineChartCard = lazy(() => import("../../Templates/LineChartCard"));
const StatusChart = lazy(() => import("../../Templates/StatusChart"));

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
  const { allstats, issues = [], loadingIssues, loadingStats } = useIssues();

  const initialStats = {
    category: {
      maintenance: 0,
      cleanliness: 0,
      facilities: 0,
      security: 0,
      infrastructure: 0,
    },
    priority: { low: 0, medium: 0, high: 0, critical: 0 },
    location: { boysHostel: 0, girlsHostel: 0, campus: 0, adminBuilding: 0 },
  };

  const stats = issues.reduce((acc, issue) => {
    const category = issue.main_category?.toLowerCase().trim();
    const priority = issue.priority?.toLowerCase().trim();
    const location = issue.location_address?.toLowerCase().trim();

    if (category && acc.category[category] !== undefined)
      acc.category[category] += 1;
    if (priority && acc.priority[priority] !== undefined)
      acc.priority[priority] += 1;
    if (location === "boys hostel") acc.location.boysHostel += 1;
    if (location === "girls hostel") acc.location.girlsHostel += 1;
    if (location === "campus") acc.location.campus += 1;
    if (location === "admin building") acc.location.adminBuilding += 1;

    return acc;
  }, initialStats);

  console.log(stats);

  const { category, priority, location } = stats;

  // Status cards data
  const statusCards = [
    {
      name: "Total Issues",
      count: allstats?.issues?.total || 0,
      description: "All reported issues",
      color: "from-[#980101] to-[#FF2C2C]",
      color2: "bg-[#980101]",
      link: "/reported-issues",
    },
    {
      name: "Pending Issues",
      count: allstats?.issues?.by_status?.new || 0,
      description: "New & Pending",
      color: "from-[#F5A623] to-[#F8E71C]",
      color2: "bg-[#F5A623]",
      link: "/pending-issues",
    },
    {
      name: "In Progress",
      count: allstats?.issues?.by_status?.in_progress || 0,
      description: "Assigned & In Progress",
      color: "from-[#00284B] to-[#0088FF]",
      color2: "bg-[#00284B]",
      link: "/in-progress",
    },
    {
      name: "Resolved Issues",
      count: allstats?.issues?.by_status?.resolved || 0,
      description: "Issues Fixed",
      color: "from-[#0D4900] to-[#2DF300]",
      color2: "bg-[#0D4900]",
      link: "/resolved-issues",
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
  ];

  const barChartData = [
    { status: "Low", count: priority.low },
    { status: "Medium", count: priority.medium },
    { status: "High", count: priority.high },
    { status: "Critical", count: priority.critical },
  ];

  const locationData = [
    { name: "Admin Building", value: location.adminBuilding, color: "#F6DE4B" },
    { name: "Campus", value: location.campus, color: "#40c057" },
    { name: "Boys Hostel", value: location.boysHostel, color: "#3086D5" },
    { name: "Girls Hostel", value: location.girlsHostel, color: "#E34A4D" },
  ];

  const hasIssues = issues.length > 0;

  return (
    <>
      <SideNav />
      <BottomNav />

      <div className="w-full pb-20 md:pb-2 p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-white overflow-x-auto">
        <div className="w-full bg-violet-500 p-4 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Main Dashboard
            </h1>
            <Searchbar />
          </div>
        </div>

        <div className="w-full mt-4 gap-3 sm:gap-4 flex flex-wrap justify-center bg-[#F0EEFF] p-3 sm:p-4 lg:p-6 rounded-2xl">
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

        <h1 className="pt-2 pb-1 pl-2 text-xl sm:text-2xl font-semibold text-[#363434]">
          Issue Stats
        </h1>

        <div className="bg-[#F0EEFF] p-4 rounded-2xl">
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
                  <PieChartCard data={pieChartData} />
                </Suspense>

                <Suspense fallback={<ChartSkeleton />}>
                  <BarChartCard data={barChartData} />
                </Suspense>

                <Suspense fallback={<ChartSkeleton />}>
                  <StatusChart data={locationData} />
                </Suspense>
              </>
            )}
          </div>
          <div className="pt-3">
            {loadingIssues ? (
              <ChartSkeleton height={120} />
            ) : (
              <Suspense fallback={<ChartSkeleton height={120} />}>
                <LineChartCard />
              </Suspense>
            )}
          </div>
        </div>

        {/* ========== TOP REPORTERS ========== */}
        <h1 className="pt-2 pb-1 pl-2 text-xl sm:text-2xl font-semibold text-[#363434]">
          Top Reporters
        </h1>

        <div className="bg-[#F0EEFF] p-2 lg:p-4 mt-1 rounded-2xl">
          {loadingStats ? <UserSectionSkeleton /> : <UserCard limit={3} />}

          <div className="flex justify-end mt-3">
            <Link
              to="/leaderboard"
              className="text-xs lg:text-sm font-semibold text-[#243b8c] hover:text-[#1b2f6b] hover:underline transition"
            >
              View Full Leaderboard →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
