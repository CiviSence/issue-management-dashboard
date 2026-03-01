import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import { useIssues } from "../../../Context/IssueContext";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { assignIssue, deleteIssue, updateIssue } from "../../../Utils/issues";
import { toast, ToastContainer } from "react-toastify";
import { useUsers } from "../../../Context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";


const IssuesSkeleton = () => {
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
          {[...Array(16)].map((_, i) => (
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
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-lg p-4 shadow-sm space-y-3">
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

const ReportedIssues = () => {
  const navigate = useNavigate();
  const { issues, setIssues } = useIssues();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priority, setPriority] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const { staff, fetchStaff } = useUsers();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const openAssignModal = (issueId) => {
    setSelectedIssue(issueId);
    setShowAssignModal(true);
  };

  //delete issue handler
  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    const previousIssues = issues;

    // to remove immidiatly from UI
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId));

    try {
      await deleteIssue(issueId);
      toast.success("Issue deleted successfully!");
    } catch (error) {
      setIssues(previousIssues);
      toast.error("Failed to delete issue.");
    }
  };

  //status handler to change status of issue
  const handleSetStatus = async (issueId, newStatus) => {
    const previousIssues = issues;

    //update UI instantly
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue,
      ),
    );

    try {
      await updateIssue(issueId, { status: newStatus });
      toast.success("Issue status updated!");
    } catch (error) {
      setIssues(previousIssues);
      toast.error("Failed to update issue status.");
    }
  };

  //set priority of the issue
  const handleSetPriority = async (issueId, newPriority) => {
    const previousIssues = issues;

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, priority: newPriority } : issue,
      ),
    );

    try {
      await updateIssue(issueId, { priority: newPriority });
      toast.success("Priority updated!");
    } catch (error) {
      setIssues(previousIssues);
      toast.error("Failed to update priority.");
    }
  };

  const handleMarkSpam = async (issueId) => {
    const previousIssues = issues;

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: "spam" } : issue,
      ),
    );

    try {
      await updateIssue(issueId, { status: "spam" });
      toast.success("Issue marked as spam!");
    } catch (error) {
      setIssues(previousIssues);
      toast.error("Failed to mark issue as spam.");
    }
  };

  const handleAssign = async (staffId) => {
    try {
      await assignIssue(selectedIssue, staffId);

      toast.success("Staff assigned successfully!");
      setShowAssignModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to assign staff",
      );
    }
  };

  //filtering issues based on location and priority for the dropdowns
  const filteredIssues = issues.filter((issue) => {
    const locationMatch =
      selectedLocation === "all" ||
      issue.location_building === selectedLocation;

    const priorityMatch =
      priority === "all" ||
      issue.priority?.toLowerCase() === priority.toLowerCase();

    return locationMatch && priorityMatch;
  });

  const uniqueLocations = [
    ...new Set(issues.map((i) => i.location_building).filter(Boolean)),
  ];

  //color codes for different categories, priority and status
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
    new: "bg-sky-100 text-sky-800",
  };

  const statusColor = {
    new: "bg-sky-100 text-sky-800",
    acknowledged: "bg-indigo-100 text-indigo-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-emerald-100 text-emerald-800",
    closed: "bg-zinc-200 text-zinc-800",
    spam: "bg-yellow-100 text-yellow-800",
  };

  useEffect(() => {
    fetchStaff();
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

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
      {issues.length > 0 ? (
        <>
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
                  All Issues
                </h1>
                {/* Searchbar */}
                <Searchbar />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-2 lg:p-5 w-full mt-2">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Reported Issues
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
                      <th className="text-left p-3">Reported By</th>
                      <th className="text-left p-3">Assigned to</th>

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
                            {issue.main_category.charAt(0).toUpperCase() +
                              issue.main_category.slice(1)}
                          </span>
                        </td>

                        <td className="p-3">
                          {issue.location_building
                            ?.split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ") || "Not Available"}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor[issue.priority]}`}
                          >
                            {issue.priority.charAt(0).toUpperCase() +
                              issue.priority.slice(1)}
                          </span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[issue.status]}`}
                          >
                            {issue.status.charAt(0).toUpperCase() +
                              issue.status.slice(1).replace("_", " ")}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              {issue.user_name}
                            </span>
                            <span className="text-xs text-gray-400">
                              Date: {issue.created_at.split("T")[0]}
                            </span>
                          </div>
                        </td>

                        <td className="p-3 ">
                          {issue.assigned_to ? (
                            issue.assigned_to_name
                          ) : (
                            <p className="text-red-400">unassigned</p>
                          )}
                        </td>

                        <td className="p-3 relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === issue.id ? null : issue.id,
                              );
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-gray-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>

                          {openDropdown === issue.id && (
                            <div
                              onMouseLeave={() => setActiveSubMenu(null)}
                              className="absolute right-0  mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-50 text-sm"
                            >
                              {/* details*/}
                              <button
                                onClick={() =>
                                  navigate(`/issues/${issue.id}`, {
                                    state: issue,
                                  })
                                }
                                className="w-full text-left px-4 py-2 hover:bg-gray-50"
                              >
                                Details
                              </button>
                              {/* Set Status */}
                              <div className="relative">
                                <button
                                  onMouseEnter={() =>
                                    setActiveSubMenu("status")
                                  }
                                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                                >
                                  Set Status
                                  <span>›</span>
                                </button>

                                {activeSubMenu === "status" && (
                                  <div className="absolute right-full top-1 mr-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
                                    {[
                                      "new",
                                      "acknowledged",
                                      "in_progress",
                                      "resolved",
                                      "closed",
                                    ].map((status) => (
                                      <button
                                        key={status}
                                        onClick={() => {
                                          handleSetStatus(issue.id, status);
                                          setActiveSubMenu(null);
                                          setOpenDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                      >
                                        {status.replace("_", " ")}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Set Priority */}
                              <div className="relative">
                                <button
                                  onMouseEnter={() =>
                                    setActiveSubMenu("priority")
                                  }
                                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex justify-between items-center"
                                >
                                  Set Priority
                                  <span>›</span>
                                </button>

                                {activeSubMenu === "priority" && (
                                  <div
                                    className="absolute right-full mr-1 top-0
 w-44 bg-white rounded-xl shadow-lg border border-gray-100"
                                  >
                                    {["critical", "high", "medium", "low"].map(
                                      (level) => (
                                        <button
                                          key={level}
                                          onClick={() => {
                                            handleSetPriority(issue.id, level);
                                            setActiveSubMenu(null);
                                            setOpenDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                        >
                                          {level}
                                        </button>
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="border-t border-gray-100 my-1"></div>

                              {/* Assign */}
                              <button
                                onClick={() => openAssignModal(issue.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50"
                              >
                                Assign
                              </button>

                              {/* Mark Spam */}
                              <button
                                onClick={() => handleMarkSpam(issue.id)}
                                className="w-full text-left px-4 py-2 text-yellow-600 hover:bg-yellow-50"
                              >
                                Mark as Spam
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(issue.id)}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
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
                    className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 space-y-4 transition active:scale-[0.98]"
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                          {issue.title}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {issue.location_building}
                        </p>
                      </div>

                      {/* STATUS */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColor[issue.status]}`}
                      >
                        {issue.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Category + Priority Row */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${categoryColor[issue.main_category]}`}
                      >
                        {issue.main_category}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${priorityColor[issue.priority]}`}
                      >
                        {issue.priority} Priority
                      </span>
                    </div>

                    {/* User + Date */}
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <i className="ri-user-line"></i>
                        <span>{issue.user_name}</span>
                      </div>

                      <span>{issue.created_at.split("T")[0]}</span>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() =>
                        navigate(`/issues/${issue.id}`, {
                          state: issue,
                        })
                      }
                      className="w-full bg-violet-50 text-violet-600 text-sm font-medium py-2 rounded-lg hover:bg-violet-100 transition"
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <IssuesSkeleton />
      )}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white p-6 rounded-2xl w-96 shadow-2xl animate-scaleIn">
            <h2 className="text-lg font-semibold mb-4">Assign Staff</h2>

            <select
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => handleAssign(e.target.value)}
            >
              <option value="">Select Staff</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportedIssues;
