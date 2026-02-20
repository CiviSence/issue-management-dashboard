import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useIssues } from "../../../Context/IssueContext";
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
          <div className="flex gap-2">
            <Skeleton height={38} width={140} />
            <Skeleton height={38} width={140} />
          </div>
        </div>

        {/* ===== DESKTOP TABLE SKELETON ===== */}
        <div className="hidden md:block">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 py-3  last:border-none"
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
            <div key={i} className="border rounded-lg p-4 shadow-sm space-y-3">
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
  const { resolvedIssues, setResolvedIssues } = useIssues();

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
      {resolvedIssues.length > 0 ? (
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
                  Resloved Issues
                </h1>
                {/* Searchbar */}
                <Searchbar />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 w-full mt-4">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Resolved Issues
                </h2>

                <div className="flex gap-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition duration-200"
                  >
                    <option value="">Location: All</option>
                    {uniqueLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition duration-200"
                  >
                    <option value="">Priority: All</option>
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

                      <button className="text-violet-600 font-medium">
                        View →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <SkeletonLoader />
      )}
    </>
  );
};

export default ResolvedIssues;
