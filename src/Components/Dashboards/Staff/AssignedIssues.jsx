import { useEffect, useState, useCallback } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues } from "../../../Utils/issues";
import StatusUpdateModal from "./StatusUpdateModal";

const AssignedIssues = () => {
  const { profileData } = useUser();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssigned = useCallback(async () => {
    if (profileData?.id) {
      setLoading(true);
      try {
        const data = await getAssignedIssues(profileData.id);
        setAssignedIssues(data);
      } catch (error) {
        console.error("Error fetching assigned issues:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [profileData?.id]);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

  const handleUpdateClick = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-background text-foreground min-h-screen overflow-y-auto transition-colors duration-200">
        <div className="w-full bg-violet-500 p-4 sm:p-5  lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* LEFT */}
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Assigned Issues
              </h1>

              <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                Issues assigned to you!!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-card-foreground">
              Task List
            </h2>
            <Searchbar />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : assignedIssues.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {assignedIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="p-5 border border-border rounded-xl hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-card-foreground text-lg mb-1">
                        {issue.title}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            issue.priority === "high"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : issue.priority === "medium"
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {issue.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            issue.status === "pending"
                              ? "bg-muted text-muted-foreground"
                              : issue.status === "in_progress"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUpdateClick(issue)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground/70">
                    <span>
                      Reported on:{" "}
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                    <span>Location: {issue.location || "N/A"}</span>
                  </div>
                  {issue.status === "resolved" && issue.resolution_notes && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                      <p className="text-xs font-bold text-green-800 dark:text-green-400 mb-1">
                        Resolution Notes:
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 italic">
                        {issue.resolution_notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-xl border border-dashed border-border text-muted-foreground">
              No tasks assigned currently.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedIssue && (
        <StatusUpdateModal
          issue={selectedIssue}
          onClose={() => setIsModalOpen(false)}
          onUpdate={fetchAssigned}
        />
      )}
    </>
  );
};

export default AssignedIssues;
