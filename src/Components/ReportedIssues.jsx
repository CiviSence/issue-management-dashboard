import SideNav from "./Templates/SideNav";
import BottomNav from "./Templates/BottomNav";
import Searchbar from "./Templates/Searchbar";

import { useIssues } from "../Context/IssueContext";
import { useState } from "react";

const ReportedIssues = () => {
  const { issues } = useIssues();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priority, setPriority] = useState("all");

  const filteredIssues = issues.filter((issue) => {
    const locationMatch =
      selectedLocation === "all" || issue.location_address === selectedLocation;

    const priorityMatch =
      priority === "all" ||
      issue.priority?.toLowerCase() === priority.toLowerCase();

    return locationMatch && priorityMatch;
  });

  const uniqueLocations = [
    ...new Set(issues.map((i) => i.location_address).filter(Boolean)),
  ];

  const categoryColor = {
    Maintenance: "bg-blue-100 text-blue-700",
    Electrical: "bg-red-100 text-red-700",
    Infrastructure: "bg-yellow-100 text-yellow-800",
    Cleanliness: "bg-green-100 text-green-700",
  };

  const priorityColor = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <>
      <SideNav />
      <BottomNav />
      {issues ? (
        <>
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
                  All Issues
                </h1>
                {/* Searchbar */}
                <Searchbar />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 w-full mt-4">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Reported Issues
                </h2>

                <div className="flex gap-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
                  >
                    <option value="all">Location: All</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
                  >
                    <option value="all">Priority: All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
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
                    {filteredIssues?.map((issue, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="p-3 font-medium">{issue.title}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor[issue.main_category]}`}
                          >
                            {issue.main_category}
                          </span>
                        </td>

                        <td className="p-3">{issue.location_address}</td>

                        <td className="p-3">
                          <span
                            className={` text-xs text-center px-3 py-1 rounded-full ${priorityColor[issue.priority]}`}
                          >
                            {issue.priority}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                            {issue.status}
                          </span>
                        </td>

                        <td className="p-3 text-gray-500">
                          {issue.created_at.split("T")[0]}
                        </td>

                        <td className="p-3 text-blue-600 cursor-pointer">
                          Action
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== MOBILE CARDS ===== */}
              <div className="md:hidden space-y-4">
                {filteredIssues.map((issue, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 shadow-sm space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{issue.title}</h3>
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full`}
                      >
                        {issue.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span
                        className={`px-3 py-1 rounded-full ${categoryColor[issue.main_category]}`}
                      >
                        {issue.category}
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                        Resolved
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      📍 {issue.location_address}
                    </p>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{issue.created_at.split("T")[0]}</span>
                      <span className="text-blue-600 cursor-pointer">
                        Action
                      </span>
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
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ReportedIssues;
