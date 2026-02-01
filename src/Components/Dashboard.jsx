import React from "react";
import SideNav from "./Templates/SideNav";
import Searchbar from "./Templates/Searchbar";
import IssueCard from "./Templates/IssueCard";
import RecentReportsCard from "./Templates/RecentReportsCard";
import TopLocations from "./Templates/TopLocations";
import BottomNav from "./Templates/BottomNav";
import PieChartCard from "./Templates/PieChartCard";
import BarChartCard from "./Templates/BarChartCard";
import LineChartCard from "./Templates/LineChartCard";
import StatusChart from "./Templates/StatusChart";
import UserCard from "./Templates/UserCard";

const Dashboard = () => {
  const issues = [
    {
      name: "Total Issues",
      count: 256,
      description: "All reported issues",
      color: "from-[#980101] to-[#FF2C2C]",
      color2: "bg-[#980101]",
    },
    {
      name: "Open Issues",
      count: 200,
      description: "Pending Cases",
      color: "from-[#F5A623] to-[#F8E71C]",
      color2: "bg-[#F5A623]",
    },
    {
      name: "In Progress",
      count: 100,
      description: "Under Review",
      color: "from-[#00284B] to-[#0088FF]",
      color2: "bg-[#00284B]",
    },
    {
      name: "Resolved Issues",
      count: 56,
      description: "Issues Fixed",
      color: "from-[#0D4900] to-[#2DF300]",
      color2: "bg-[#0D4900]",
    },
  ];

  const recentReports = [
    {
      id: 1,
      issue: "Broken Tap",
      location: "Boys Hostel",
      status: "Open",
      reported: "1 hour ago",
    },
    {
      id: 2,
      issue: "Water Leakage",
      location: "Girls Hostel",
      status: "Open",
      reported: "12 hours ago",
    },
    {
      id: 3,
      issue: "Projector not working",
      location: "Admin Building",
      status: "In Progress",
      reported: "Yesterday",
    },
    {
      id: 4,
      issue: "Broken window",
      location: "Boys Hostel",
      status: "Pending",
      reported: "2 days ago",
    },
    {
      id: 5,
      issue: "Tube light not working",
      location: "Boys Hostel",
      status: "Resolved",
      reported: "3 days ago",
    },
  ];

  // const data = [
  //   { name: "Jan", users: 400 },
  //   { name: "Feb", users: 300 },
  //   { name: "Mar", users: 500 },
  //   { name: "April", users: 100 },
  //   { name: "May", users: 150 },
  //   { name: "June", users: 200 },
  // ];

  return (
    <>
      <SideNav />
      <BottomNav />

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
          {issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))}
        </div>
        <h1 className="pt-2 pb-1 pl-2 text-xl sm:text-2xl font-semibold text-[#363434]  ">
          Issue Stats
        </h1>
        <div className="bg-[#F0EEFF] p-4 rounded-2xl">
          <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ">
            <PieChartCard />
            <BarChartCard />
            <LineChartCard />
          </div>
          <div className="pt-3">
            <StatusChart />
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
  );
};

export default Dashboard;
