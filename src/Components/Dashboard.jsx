import SideNav from "./Templates/SideNav";
import Searchbar from "./Templates/Searchbar";
import IssueCard from "./Templates/IssueCard";
import BottomNav from "./Templates/BottomNav";
import PieChartCard from "./Templates/PieChartCard";
import BarChartCard from "./Templates/BarChartCard";
import LineChartCard from "./Templates/LineChartCard";
import StatusChart from "./Templates/StatusChart";
import UserCard from "./Templates/UserCard";
import { useIssues } from "../Context/IssueContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardSkeleton = () => {
  return (
    <div className="w-full h-screen p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-white overflow-auto">
      {/* Header */}
      <div className="w-full flex justify-between bg-violet-200 p-4 rounded-2xl mb-4">
        <Skeleton height={40} width={220} borderRadius={8} />
        <Skeleton height={48} width={320} borderRadius={8} />
      </div>

      {/* Issue Cards */}
      <div className="w-full mt-4 gap-2 flex flex-wrap justify-center bg-[#F0EEFF] p-4 rounded-2xl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full sm:w-[48%] lg:w-[35%] xl:w-[24%]">
            <Skeleton height={112} borderRadius={12} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-4 bg-[#F0EEFF] p-4 rounded-2xl">
        <Skeleton height={24} width={160} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <Skeleton height={260} borderRadius={12} />
          <Skeleton height={260} borderRadius={12} />
          <Skeleton height={260} borderRadius={12} />
        </div>
      </div>

      {/* User card */}
      <div className="bg-[#F0EEFF] p-4 mt-4 rounded-2xl">
        <Skeleton height={200} borderRadius={12} />
      </div>

      <div className="bg-[#F0EEFF] p-4 mt-4 rounded-2xl">
        <Skeleton height={200} borderRadius={12} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  //get all issues
  const { issues } = useIssues();
  console.log(issues);

  const initialStats = {
    category: {
      maintenance: 0,
      cleanliness: 0,
      facilities: 0,
      security: 0,
      infrastructure: 0,
    },
    status: {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
    },
    priority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    location: {
      boysHostel: 0,
      girlsHostel: 0,
      campus: 0,
      adminBuilding: 0,
    },
  };

  const stats = issues.reduce((acc, issue) => {
    // normalize once
    const category = issue.main_category?.toLowerCase().trim();
    const status = issue.status?.toLowerCase().trim();
    const priority = issue.priority?.toLowerCase().trim();
    const location = issue.location_address?.toLowerCase().trim();

    // total
    acc.status.total += 1;

    // category
    if (category && acc.category[category] !== undefined) {
      acc.category[category] += 1;
    }

    // status
    if (status === "acknowledged") acc.status.pending += 1;
    if (status === "in_progress") acc.status.inProgress += 1;
    if (status === "resolved") acc.status.resolved += 1;

    // priority
    if (priority && acc.priority[priority] !== undefined) {
      acc.priority[priority] += 1;
    }

    // location
    if (location === "boys hostel") acc.location.boysHostel += 1;
    if (location === "girls hostel") acc.location.girlsHostel += 1;
    if (location === "campus") acc.location.campus += 1;
    if (location === "admin building") acc.location.adminBuilding += 1;

    return acc;
  }, initialStats);

  const { category, status, priority, location } = stats;

  console.log(priority);
  console.log(category);
  console.log(status);
  console.log(location);

  //issue card colors and count
  const statusCards = [
    {
      name: "Total Issues",
      count: status.total,
      description: "All reported issues",
      color: "from-[#980101] to-[#FF2C2C]",
      color2: "bg-[#980101]",
      link: "/reported-issues",
    },
    {
      name: "Pending Issues",
      count: status.pending,
      description: "Open & In Progress",
      color: "from-[#F5A623] to-[#F8E71C]",
      color2: "bg-[#F5A623]",
    },
    {
      name: "In Progress",
      count: status.inProgress,
      description: "Open & In Progress",
      color: "from-[#00284B] to-[#0088FF]",
      color2: "bg-[#00284B]",
    },
    {
      name: "Resolved Issues",
      count: status.resolved,
      description: "Issues Fixed",
      color: "from-[#0D4900] to-[#2DF300]",
      color2: "bg-[#0D4900]",
      link: "/resolved-issues",
    },
  ];

  //data for PieChart
  const PieChartData = [
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

  //data for bar chart
  const barChartData = [
    { status: "Low", count: priority.low },
    { status: "Medium", count: priority.medium },
    { status: "High", count: priority.high },
    { status: "Critical", count: priority.critical },
  ];

  //Location data to vorizontal bar chart
  const locationData = [
    { name: "Admin Building", value: location.adminBuilding, color: "#F6DE4B" },
    { name: "Campus", value: location.campus, color: "#40c057" },
    { name: "Boys Hostel", value: location.boysHostel, color: "#3086D5" },
    { name: "Girls Hostel", value: location.girlsHostel, color: "#E34A4D" },
  ];

  return (
    <>
      <SideNav />
      <BottomNav />

      {issues.length > 0 ? (
        <>
          <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-white overflow-x-auto ">
            <div className="w-full bg-violet-500 p-4 rounded-2xl">
              <div
                className="
      flex
      flex-col
      sm:flex-row
      sm:items-center
      sm:justify-between
      gap-2
    "
              >
                {/* Dashboard Title */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-white">
                  Main Dashboard
                </h1>
                {/* Searchbar */}
                <Searchbar />
              </div>
            </div>

            {/* Issue Cards */}
            <div className="w-full mt-4 gap-2 flex flex-wrap justify-center bg-[#F0EEFF] p-4 rounded-2xl">
              {statusCards.map((item, index) => (
                <IssueCard key={index} issue={item} />
              ))}
            </div>
            <h1 className="pt-2 pb-1 pl-2 text-xl sm:text-2xl font-semibold text-[#363434]  ">
              Issue Stats
            </h1>
            <div className="bg-[#F0EEFF] p-4 rounded-2xl">
              <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ">
                <PieChartCard data={PieChartData} />
                <BarChartCard data={barChartData} />
                <LineChartCard />
              </div>
              <div className="pt-3">
                <StatusChart data={locationData} />
              </div>
            </div>
            <div className="bg-[#F0EEFF] p-4 mt-4 rounded-2xl">
              <UserCard />
            </div>

            {/* Reports + Chart */}
            {/* <div className="mt-10 flex flex-col lg:flex-row gap-6">
            <RecentReportsCard recentReports={recentReports} />
            <TopLocations />
          </div> */}
          </div>
        </>
      ) : (
        <DashboardSkeleton />
      )}
    </>
  );
};

export default Dashboard;
