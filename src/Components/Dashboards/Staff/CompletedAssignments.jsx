import { useEffect, useState, useCallback, useRef } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import {
  getAssignedIssues,
  acceptAssignment,
  rejectAssignment,
} from "../../../Utils/staffissues";
import StatusUpdateModal from "./StatusUpdateModal";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import { MoreVertical, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import StatusBadge from "../../Templates/StatusBadge";

const CompletedAssignment = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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

 return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-background text-foreground min-h-screen overflow-y-auto transition-colors duration-200">
        <div className="w-full bg-violet-500 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Completed Assignments
              </h1>
              <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                All assignments complted by you!!
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : assignedIssues?.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 text-xs uppercase text-left">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Issue
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Priority
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {assignedIssues.map((issue) => (
                    <tr
                      key={issue.assignment_id}
                      className="hover:bg-muted/40 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-card-foreground">
                          {issue?.title || "Untitled Issue"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          #{issue.issue_id}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge type="priority" value={issue?.priority || "low"} />
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge type="status" value={issue?.assignment_status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/tasks/${issue.issue_id}`, {
                              state: issue,
                            })
                          }
                          className="inline-block px-4 py-1.5 text-xs font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition shadow-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm text-muted-foreground mt-1">
              You're all caught up!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CompletedAssignment;
