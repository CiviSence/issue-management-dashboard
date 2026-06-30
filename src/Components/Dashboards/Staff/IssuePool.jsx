import { useEffect, useState, useCallback, useMemo } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import TopBar from "../../Templates/TopBar";
import { getAllIssues } from "../../../Utils/issues";
import { selfAssignIssue } from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Loader2,
  Clock,
  Search,
  ArrowRight,
  ClipboardList,
  LayoutGrid,
  List,
} from "lucide-react";
import StatusBadge from "../../Templates/StatusBadge";

const IssuePool = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards");

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchPool = useCallback(async () => {
    setLoading(true);
    try {
      // Assuming 'new' status means unassigned in the workflow
      // and we might need to filter out issues that already have an assigned_to locally just in case
      const data = await getAllIssues({ status: "new" });
      const unassigned = data.filter(issue => !issue.assigned_to);
      setIssues(unassigned);
    } catch (error) {
      console.error("Error fetching issue pool:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPool();
  }, [fetchPool]);

  const filteredIssues = useMemo(() => {
    let result = issues;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) || String(i.id).includes(q),
      );
    }
    return result;
  }, [issues, searchQuery]);

  const handleSelfAssign = async (issueId) => {
    setActionLoading(issueId);
    try {
      await selfAssignIssue(issueId);
      // Remove it from the local list upon success
      setIssues(prev => prev.filter(i => i.id !== issueId));
      // Optionally show a toast here
    } catch (error) {
      console.error("Error self-assigning issue:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20">
        <TopBar title="Issue Pool" />
        <div className="w-full mx-auto p-2 lg:p-4">
          <div className="p-2 md:p-0">
            <div className="flex flex-col sm:flex-row gap-1 md:gap-2 lg:gap-3 mb-0 md:mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search unassigned issues..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full lg:rounded-xl text-sm text-card-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] transition-all"
                />
              </div>

              <div className="flex gap-2">
                <div className="hidden md:flex bg-card border border-border rounded-xl p-1 gap-0.5">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "cards"
                        ? "bg-[#6366f1] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "table"
                        ? "bg-[#6366f1] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2 pt-0 md:p-0">
            {loading ? (
              <Loader />
            ) : filteredIssues.length > 0 ? (
              <>
                {(viewMode === "cards" ||
                  (typeof window !== "undefined" && window.innerWidth < 768)) && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 md:gap-4 ${viewMode === "table" ? "md:hidden" : ""}`}>
                      {filteredIssues.map((issue) => {
                        const isLoading = actionLoading === issue.id;

                        return (
                          <div
                            key={issue.id}
                            className="bg-card rounded-xl border border-border hover:border-border/80 hover:shadow-md transition-all duration-200 flex flex-col"
                          >
                            <div
                              className="p-4 flex-1 flex flex-col cursor-pointer"
                              onClick={() => navigate(`/tasks/${issue.id}`, { state: issue })}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border bg-gray-50 text-gray-700 border-gray-200">
                                  Unassigned
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">
                                  #{issue.id}
                                </span>
                              </div>
                              <h3 className="font-semibold text-card-foreground text-[15px] leading-snug line-clamp-2 mb-3">
                                {issue?.title || "Untitled Issue"}
                              </h3>
                              <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                                {issue.created_at && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDateShort(issue.created_at)}
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
                                <button
                                  onClick={() => handleSelfAssign(issue.id)}
                                  disabled={isLoading}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  {isLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  )}
                                  Assign to Me
                                </button>
                                <button
                                  onClick={() => navigate(`/tasks/${issue.id}`, { state: issue })}
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

                {viewMode === "table" && (
                  <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                            <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredIssues.map((issue) => {
                            const isLoading = actionLoading === issue.id;

                            return (
                              <tr
                                key={issue.id}
                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => navigate(`/tasks/${issue.id}`, { state: issue })}
                              >
                                <td className="px-5 py-3.5">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm text-card-foreground line-clamp-1">{issue?.title || "Untitled Issue"}</span>
                                    <span className="text-xs text-muted-foreground font-mono mt-0.5">#{issue.id}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-3.5">
                                  <StatusBadge type="priority" value={issue?.priority || "low"} />
                                </td>
                                <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDateShort(issue.created_at)}
                                </td>
                                <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleSelfAssign(issue.id)}
                                      disabled={isLoading}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                    >
                                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                      Assign to Me
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
                  <ClipboardList className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-1">
                  {searchQuery ? "No matching issues" : "No unassigned issues"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs text-center">
                  {searchQuery
                    ? "Try adjusting your search to find what you're looking for."
                    : "There are no issues in the pool right now."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/20 rounded-xl transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IssuePool;
