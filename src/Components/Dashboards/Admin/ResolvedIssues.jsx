import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useIssues } from "../../../Context/IssueContext.js";
import { useState } from "react";
import { deleteIssue } from "../../../Utils/issues";
import { toast, ToastContainer } from "react-toastify";

const SkeletonLoader = () => {
  return (
    <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] overflow-x-auto">
      {/* Header */}
      <div className="w-full bg-violet-300 p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Skeleton height={36} width={180} />
          <Skeleton height={44} width={260} />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 w-full mt-4">
        {/* Table header */}
        <div className="flex justify-between items-center mb-5">
          <Skeleton height={24} width={200} />
          <div className="flex gap-2 flex-col md:flex-row">
            <Skeleton height={38} width={140} />
            <Skeleton height={38} width={140} />
          </div>
        </div>

        {/* ===== DESKTOP TABLE SKELETON ===== */}
        <div className="hidden md:block">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 py-3 border-none"
            >
              <Skeleton height={25} />
              <Skeleton height={25} />
              <Skeleton height={25} />
              <Skeleton height={25} />
              <Skeleton height={25} />
            </div>
          ))}
        </div>

        {/* ===== MOBILE CARDS SKELETON ===== */}
        <div className="md:hidden space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className=" rounded-lg p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton height={18} width={180} />
                <Skeleton height={20} width={70} />
              </div>

              <div className="flex gap-2">
                <Skeleton height={20} width={80} />
                <Skeleton height={20} width={80} />
              </div>

              <Skeleton height={16} width="90%" />

              <div className="flex justify-between">
                <Skeleton height={14} width={100} />
                <Skeleton height={14} width={60} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResolvedIssues = () => {
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priority, setPriority] = useState("all");
  const { resolvedIssues, setResolvedIssues, loadingResolved } = useIssues();

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    const previousIssues = resolvedIssues;
    setResolvedIssues((prev) => prev.filter((issue) => issue.id !== id));

    try {
      await deleteIssue(id);
      toast.success("Issue deleted successfully!");
    } catch (error) {
      setResolvedIssues(previousIssues);
      toast.error(error.message || "Failed to delete issue");
    }
  };

  const filteredIssues = resolvedIssues.filter((issue) => {
    const locationMatch =
      selectedLocation === "all" || issue.location_address === selectedLocation;

    const priorityMatch =
      priority === "all" ||
      issue.priority?.toLowerCase() === priority.toLowerCase();

    return locationMatch && priorityMatch;
  });

  const uniqueLocations = [
    ...new Set(resolvedIssues.map((i) => i.location_address).filter(Boolean)),
  ];

  const categoryColor = {
    security: "bg-blue-100 text-blue-800",
    maintenance: "bg-red-100 text-red-800",
    infrastructure: "bg-amber-100 text-amber-800",
    cleanliness: "bg-emerald-100 text-emerald-800",
    facilities: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  };

  const priorityColor = {
    critical: "bg-red-300 text-red-800",
    high: "bg-red-100 text-red-800",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-emerald-100 text-emerald-800",
  };

  const statusColor = {
    new: "bg-sky-100 text-sky-800",
    acknowledged: "bg-indigo-100 text-indigo-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-emerald-100 text-emerald-800",
    closed: "bg-zinc-200 text-zinc-800",
    spam: "bg-yellow-100 text-yellow-800",
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <SideNav />
      <BottomNav />
      
          <div className="w-full pb-20 md:pb-2 p-2 lg:p-4 lg:w-[calc(100vw-15vw)]  overflow-x-auto ">
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
                  Resloved Issues
                </h1>
                {/* Searchbar */}
                <Searchbar />
              </div>
            </div>
{loadingResolved ? (
        <SkeletonLoader />
      ) : resolvedIssues.length > 0 ? (
        <>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 w-full mt-2">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Resolved Issues
                </h2>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {/* Location Select */}
                  <div className="relative w-full sm:w-40 md:w-48">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 sm:px-4 sm:pr-10 sm:py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition duration-200 cursor-pointer"
                    >
                      <option value="all">Location: All</option>
                      {uniqueLocations.map((location, index) => (
                        <option key={index} value={location}>
                          {location
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Priority Select */}
                  <div className="relative w-full sm:w-32 md:w-36">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg pl-3 pr-8 py-2 sm:px-4 sm:pr-10 sm:py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition duration-200 cursor-pointer"
                    >
                      <option value="all">Priority: All</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
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
                      <tr
                        key={i}
                        className="border-b border-zinc-200 last:border-none"
                      >
                        <td className="p-3 font-medium">{issue.title}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor[issue.main_category]}`}
                          >
                            {issue.main_category}
                          </span>
                        </td>

                        <td className="p-3">{issue.location_address}</td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[issue.priority]}`}
                          >
                            {issue.priority}
                          </span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[issue.status]}`}
                          >
                            {issue.status.replace("_", " ")}
                          </span>
                        </td>

                        <td className="p-3 text-gray-500">
                          {issue.created_at.split("T")[0]}
                        </td>

                        <td className="p-3 cursor-pointer">
                          <i
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="ri-delete-bin-line text-xl text-gray-400 hover:text-red-500"
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== MOBILE CARDS ===== */}
              <div className="md:hidden space-y-3">
                {filteredIssues.map((issue, i) => (
                  <div
                    key={i}
                    className="
        bg-white
        rounded-xl
        p-4
        shadow-sm
        border border-gray-100
        space-y-3
        active:scale-[0.98]
        transition
      "
                  >
                    {/* Title + Priority */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                        {issue.title}
                      </h3>

                      <span
                        className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${priorityColor[issue.priority]}`}
                      >
                        {issue.priority}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${categoryColor[issue.main_category]}`}
                      >
                        {issue.main_category}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColor[issue.status]}`}
                      >
                        {issue.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span>📍</span>
                      <span>{issue.location_address}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
                      <span>{issue.created_at.split("T")[0]}</span>

                      <button onClick={() => handleDeleteIssue(issue.id)} className="text-red-400 font-medium">
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
         
        </>
      ) : (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-sm mt-4 mx-auto lg:w-[calc(100vw-15vw)]">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <i className="ri-checkbox-circle-line text-4xl text-emerald-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Resolved Issues</h2>
          <p className="text-gray-500 max-w-sm">
            Great news! There are no resolved issues to display right now. Check back later as more problems are fixed.
          </p>
        </div>
      )}
       </div>
    </>
  );
};

export default ResolvedIssues;
