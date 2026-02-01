import SideNav from "./Templates/SideNav";
import BottomNav from "./Templates/BottomNav";
import Searchbar from "./Templates/Searchbar";
import IssueCard from "./Templates/IssueCard";

const ReportedIssues = () => {
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

  const allissues = [
    {
      title: "Broken Tap",
      category: "Maintenance",
      location: "Boys Hostel",
      priority: "High",
      status: "Resolved",
      reported: "25 min ago",
    },
    {
      title: "Water Leakage",
      category: "Maintenance",
      location: "Boys Hostel",
      priority: "High",
      status: "Resolved",
      reported: "55 min ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
    
    {
      title: "Broken Window",
      category: "Maintenance",
      location: "Academic Building",
      priority: "Medium",
      status: "Resolved",
      reported: "3 hours ago",
    },
  ];

  const categoryColor = {
    Maintenance: "bg-blue-100 text-blue-700",
    Electrical: "bg-red-100 text-red-700",
    Infrastructure: "bg-yellow-100 text-yellow-800",
    Cleanliness: "bg-green-100 text-green-700",
  };

  const priorityColor = {
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-500",
  };

  return (
    <>
      <SideNav />
      <BottomNav />
      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)]  overflow-x-auto ">
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
        <div className="w-full mt-4 gap-2 flex flex-wrap justify-center bg-white p-4 rounded-2xl">
          {issues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 w-full mt-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              All Resolved Issues
            </h2>

            <div className="flex gap-2">
              <select className="border rounded-md px-3 py-1 text-sm">
                <option>Location: All</option>
              </select>
              <select className="border rounded-md px-3 py-1 text-sm">
                <option>Priority: All</option>
              </select>
            </div>
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left p-3">Issue Title</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Priority</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Reported</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {allissues.map((issue, i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="p-3 font-medium">{issue.title}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor[issue.category]}`}
                      >
                        {issue.category}
                      </span>
                    </td>

                    <td className="p-3">{issue.location}</td>

                    <td className="p-3">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${priorityColor[issue.priority]}`}
                      >
                        {issue.priority}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                        {issue.status}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">{issue.reported}</td>

                    <td className="p-3 text-blue-600 cursor-pointer">Action</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden space-y-4">
            {allissues.map((issue, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow-sm space-y-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <span
                    className={`text-white text-xs px-3 py-1 rounded-full ${priorityColor[issue.priority]}`}
                  >
                    {issue.priority}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    className={`px-3 py-1 rounded-full ${categoryColor[issue.category]}`}
                  >
                    {issue.category}
                  </span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                    Resolved
                  </span>
                </div>

                <p className="text-sm text-gray-600">📍 {issue.location}</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>{issue.reported}</span>
                  <span className="text-blue-600 cursor-pointer">Action</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <span className="text-gray-400 cursor-not-allowed">
              ← Prev Page
            </span>
            <span className="cursor-pointer font-medium">Next Page →</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportedIssues;
