import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import TopBar from "../../Templates/TopBar";
import PullToRefresh from "../../Templates/PullToRefresh";
import {
  getAssignedIssues,
  acceptAssignment,
  rejectAssignment,
  completeAssignment,
} from "../../../Utils/staffissues";
import { uploadMultipleMedia } from "../../../Utils/issuesStudent";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Upload,
  X,
  Search,
  ArrowRight,
  ClipboardList,
  Hourglass,
  CircleCheckBig,
  CircleDashed,
  LayoutGrid,
  List,
} from "lucide-react";
import StatusBadge from "../../Templates/StatusBadge";

const AssignedIssues = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [resolutionPhotos, setResolutionPhotos] = useState([]);
  const [resolutionFiles, setResolutionFiles] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchAssigned = useCallback(async () => {
    if (!profileData?.id) return;
    setLoading(true);
    try {
      const data = await getAssignedIssues(profileData.id);
      setAssignedIssues(data);
    } catch (error) {
      console.error("Error fetching assigned issues:", error);
    } finally {
      setLoading(false);
    }
  }, [profileData?.id]);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

  // Computed counts
  const counts = useMemo(() => {
    const all = assignedIssues.length;
    const pending = assignedIssues.filter(
      (i) => i.assignment_status === "pending",
    ).length;
    const accepted = assignedIssues.filter(
      (i) => i.assignment_status === "accepted",
    ).length;
    const completed = assignedIssues.filter(
      (i) => i.assignment_status === "completed",
    ).length;
    return { all, pending, accepted, completed };
  }, [assignedIssues]);

  // Filtered & searched issues
  const filteredIssues = useMemo(() => {
    let result = assignedIssues;
    if (activeFilter !== "all") {
      result = result.filter((i) => i.assignment_status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) || String(i.issue_id).includes(q),
      );
    }
    return result;
  }, [assignedIssues, activeFilter, searchQuery]);

  // Modal actions
  const submitAcceptModal = async () => {
    if (!selectedAssignmentId) return;
    setActionLoading(selectedAssignmentId);
    try {
      await acceptAssignment(selectedAssignmentId, notes);
      setNotes("");
      setActiveModal(null);
      await fetchAssigned();
    } catch (error) {
      console.error("Error accepting assignment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const submitRejectModal = async () => {
    if (!selectedAssignmentId) return;
    setActionLoading(selectedAssignmentId);
    try {
      await rejectAssignment(
        selectedAssignmentId,
        rejectionReason || "Staff rejected this assignment",
      );
      setRejectionReason("");
      setActiveModal(null);
      await fetchAssigned();
    } catch (error) {
      console.error("Error rejecting assignment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const submitCompleteModal = async () => {
    if (!selectedAssignmentId) return;
    setActionLoading(selectedAssignmentId);
    try {
      let uploadedUrls = [];
      if (resolutionFiles.length > 0) {
        uploadedUrls = await uploadMultipleMedia(resolutionFiles);
      }
      await completeAssignment(selectedAssignmentId, notes, uploadedUrls);
      setNotes("");
      setResolutionPhotos([]);
      setResolutionFiles([]);
      setActiveModal(null);
      await fetchAssigned();
    } catch (error) {
      console.error("Error completing assignment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setResolutionPhotos((prev) => [...prev, ...newPhotos]);
    setResolutionFiles((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setResolutionPhotos((prev) => prev.filter((_, i) => i !== index));
    setResolutionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const filterTabs = [
    {
      key: "all",
      label: "All",
      count: counts.all,
      icon: ClipboardList,
      color: "text-[#6366f1]",
      bg: "bg-[#6366f1]",
      lightBg: "bg-indigo-50",
    },
    {
      key: "pending",
      label: "Pending",
      count: counts.pending,
      icon: Hourglass,
      color: "text-amber-600",
      bg: "bg-amber-500",
      lightBg: "bg-amber-50",
    },
    {
      key: "accepted",
      label: "Accepted",
      count: counts.accepted,
      icon: CircleDashed,
      color: "text-blue-600",
      bg: "bg-blue-500",
      lightBg: "bg-blue-50",
    },
    {
      key: "completed",
      label: "Completed",
      count: counts.completed,
      icon: CircleCheckBig,
      color: "text-emerald-600",
      bg: "bg-emerald-500",
      lightBg: "bg-emerald-50",
    },
  ];

  return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20" id="assignedIssuesScroll">
        <TopBar title="Your Tasks" />
        <PullToRefresh scrollContainerId="assignedIssuesScroll" onRefresh={fetchAssigned}>
          <div className="w-full mx-auto p-2 lg:p-4">
          <div className="p-2 md:p-0">
            <div className="flex flex-col sm:flex-row gap-1 md:gap-2 lg:gap-3 mb-0 md:mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or issue ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full lg:rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] transition-all"
                />
              </div>

              <div className="flex gap-2">
                {/* Filter tabs */}
                <div className="flex bg-card border border-border rounded-xl p-1 gap-0.5 overflow-x-auto no-scrollbar">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeFilter === tab.key
                          ? `${tab.bg} text-white shadow-sm`
                          : "text-muted-foreground hover:bg-muted"
                        }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="">{tab.label}</span>
                      <span
                        className={`hidden md:inline ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeFilter === tab.key
                            ? "bg-white/25 text-white"
                            : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* View toggle */}
                <div className="hidden md:flex bg-card border border-border rounded-xl p-1 gap-0.5">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "cards"
                        ? "bg-[#6366f1] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                    title="Card view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "table"
                        ? "bg-[#6366f1] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                    title="Table view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ── Content ── */}
          <div className="p-2 pt-0 md:p-0">
            {loading ? (
              <Loader />
            ) : filteredIssues.length > 0 ? (
              <>
                {/* ── Card View ── */}
                {(viewMode === "cards" ||
                  (typeof window !== "undefined" && window.innerWidth < 768)) && (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-4 ${viewMode === "table" ? "md:hidden" : ""}`}
                    >
                      {filteredIssues.map((issue) => {
                        const isPending = issue.assignment_status === "pending";
                        const isAccepted = issue.assignment_status === "accepted";
                        const isCompleted = issue.assignment_status === "completed";
                        const isLoading = actionLoading === issue.assignment_id;

                        const statusConfig = {
                          pending: {
                            label: "Pending",
                            class: "bg-amber-50 text-amber-700 border-amber-200",
                          },
                          accepted: {
                            label: "In Progress",
                            class: "bg-blue-50 text-blue-700 border-blue-200",
                          },
                          completed: {
                            label: "Completed",
                            class:
                              "bg-emerald-50 text-emerald-700 border-emerald-200",
                          },
                        };
                        const badge =
                          statusConfig[issue.assignment_status] ||
                          statusConfig.pending;

                        return (
                          <div
                            key={issue.assignment_id}
                            className="bg-card rounded-xl border border-border hover:border-border/80 hover:shadow-md transition-all duration-200 flex flex-col"
                          >
                            <div
                              className="p-4 flex-1 flex flex-col cursor-pointer"
                              onClick={() =>
                                navigate(`/tasks/${issue.issue_id || issue.id}`, {
                                  state: issue,
                                })
                              }
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span
                                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${badge.class}`}
                                >
                                  {badge.label}
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">
                                  #{issue.issue_id}
                                </span>
                              </div>
                              <h3 className="font-semibold text-card-foreground text-[15px] leading-snug line-clamp-2 mb-3">
                                {issue?.title || "Untitled Issue"}
                              </h3>
                              <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                                {issue.assigned_at && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDateShort(issue.assigned_at)}
                                  </span>
                                )}
                                <StatusBadge
                                  type="priority"
                                  value={issue?.priority || "low"}
                                />
                              </div>
                            </div>
                            <div className="px-4 pb-4 pt-0">
                              <div className="border-t border-border pt-3 flex gap-2">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedAssignmentId(
                                          issue.assignment_id,
                                        );
                                        setActiveModal("accept");
                                      }}
                                      disabled={isLoading}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                      {isLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-3.5 h-3.5" />
                                      )}
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedAssignmentId(
                                          issue.assignment_id,
                                        );
                                        setActiveModal("reject");
                                      }}
                                      disabled={isLoading}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      Reject
                                    </button>
                                  </>
                                )}
                                {isAccepted && (
                                  <button
                                    onClick={() => {
                                      setSelectedAssignmentId(issue.assignment_id);
                                      setActiveModal("complete");
                                    }}
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                  >
                                    {isLoading ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    )}
                                    Complete Task
                                  </button>
                                )}
                                {isCompleted && (
                                  <div className="flex-1 flex items-center justify-center gap-1.5 py-2 text-emerald-600 text-xs font-medium">
                                    <CircleCheckBig className="w-3.5 h-3.5" /> Done
                                  </div>
                                )}
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/tasks/${issue.issue_id || issue.id}`,
                                      {
                                        state: issue,
                                      },
                                    )
                                  }
                                  className="flex items-center justify-center gap-1 px-3 py-2 text-muted-foreground hover:text-card-foreground rounded-lg text-xs font-medium transition-colors hover:bg-muted"
                                >
                                  <span>details</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                {/* ── Table View (md+ only) ── */}
                {viewMode === "table" && (
                  <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Issue
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Priority
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Status
                            </th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Assigned
                            </th>
                            <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredIssues.map((issue) => {
                            const isPending =
                              issue.assignment_status === "pending";
                            const isAccepted =
                              issue.assignment_status === "accepted";
                            const isCompleted =
                              issue.assignment_status === "completed";
                            const isLoading =
                              actionLoading === issue.assignment_id;

                            const statusConfig = {
                              pending: {
                                label: "Pending",
                                class:
                                  "bg-amber-50 text-amber-700 border-amber-200",
                              },
                              accepted: {
                                label: "In Progress",
                                class: "bg-blue-50 text-blue-700 border-blue-200",
                              },
                              completed: {
                                label: "Completed",
                                class:
                                  "bg-emerald-50 text-emerald-700 border-emerald-200",
                              },
                            };
                            const badge =
                              statusConfig[issue.assignment_status] ||
                              statusConfig.pending;

                            return (
                              <tr
                                key={issue.assignment_id}
                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() =>
                                  navigate(
                                    `/tasks/${issue.issue_id || issue.id}`,
                                    {
                                      state: issue,
                                    },
                                  )
                                }
                              >
                                <td className="px-5 py-3.5">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm text-card-foreground line-clamp-1">
                                      {issue?.title || "Untitled Issue"}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono mt-0.5">
                                      #{issue.issue_id}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5">
                                  <StatusBadge
                                    type="priority"
                                    value={issue?.priority || "low"}
                                  />
                                </td>
                                <td className="px-5 py-3.5">
                                  <span
                                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${badge.class}`}
                                  >
                                    {badge.label}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDateShort(issue.assigned_at)}
                                </td>
                                <td
                                  className="px-5 py-3.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-end gap-2">
                                    {isPending && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setSelectedAssignmentId(
                                              issue.assignment_id,
                                            );
                                            setActiveModal("accept");
                                          }}
                                          disabled={isLoading}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                        >
                                          {isLoading ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                          ) : (
                                            <CheckCircle className="w-3 h-3" />
                                          )}
                                          Accept
                                        </button>
                                        <button
                                          onClick={() => {
                                            setSelectedAssignmentId(
                                              issue.assignment_id,
                                            );
                                            setActiveModal("reject");
                                          }}
                                          disabled={isLoading}
                                          className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                        >
                                          <XCircle className="w-3 h-3" />
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    {isAccepted && (
                                      <button
                                        onClick={() => {
                                          setSelectedAssignmentId(
                                            issue.assignment_id,
                                          );
                                          setActiveModal("complete");
                                        }}
                                        disabled={isLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                      >
                                        {isLoading ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <CheckCircle className="w-3 h-3" />
                                        )}
                                        Complete
                                      </button>
                                    )}
                                    {isCompleted && (
                                      <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                                        <CircleCheckBig className="w-3.5 h-3.5" />{" "}
                                        Done
                                      </span>
                                    )}
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/tasks/${issue.issue_id || issue.id}`,
                                          { state: issue },
                                        )
                                      }
                                      className="p-1.5 text-muted-foreground hover:text-card-foreground rounded-lg transition-colors hover:bg-muted"
                                    >
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-5">
                  {searchQuery || activeFilter !== "all" ? (
                    <Search className="w-8 h-8 text-muted-foreground/50" />
                  ) : (
                    <ClipboardList className="w-8 h-8 text-muted-foreground/50" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-1">
                  {searchQuery || activeFilter !== "all"
                    ? "No matching issues"
                    : "No assigned issues"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs text-center">
                  {searchQuery || activeFilter !== "all"
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "You're all caught up! New assignments will appear here."}
                </p>
                {(searchQuery || activeFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveFilter("all");
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/20 rounded-xl transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        </PullToRefresh>

        {/* ── Accept Modal ── */}
        {activeModal === "accept" && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    Accept Task
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to accept this task? Add any notes below.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (optional)..."
                className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAcceptModal}
                  disabled={actionLoading !== null}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Reject Modal ── */}
        {activeModal === "reject" && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    Reject Task
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Please provide a reason for rejecting this task.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition-all"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejectModal}
                  disabled={actionLoading !== null || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Complete Modal ── */}
        {activeModal === "complete" && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-6 border border-border max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <CircleCheckBig className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground">
                    Complete Task
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Add completion notes and upload resolution photos.
              </p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Completion Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what was done..."
                  className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] outline-none transition-all"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Resolution Photos
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {resolutionPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#6366f1] hover:bg-muted transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-1">
                      Add
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCompleteModal}
                  disabled={actionLoading !== null}
                  className="flex-1 px-4 py-2.5 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {actionLoading !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div></>
  );
};

export default AssignedIssues;
