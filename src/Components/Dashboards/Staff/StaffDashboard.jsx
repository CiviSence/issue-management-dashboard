import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues, mySummary } from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import IssueCard from "../../Templates/IssueCard";

const StaffDashboard = () => {
  const { profileData } = useUser();

  const [summary, setSummary] = useState({});
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssigned = async () => {
    if (profileData?.id) {
      try {
        const data = await getAssignedIssues(profileData.id);
        setAssignedIssues(data);
        console.log("Issue Assigned to me : ", data);
      } catch (error) {
        console.error("Error fetching assigned issues:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSummary = async () => {
    if (profileData?.id) {
      try {
        const data = await mySummary(profileData.id);
        setSummary(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }
  };

  useEffect(() => {
    fetchAssigned();
    fetchSummary();
  }, [profileData?.id]);

  const stats = [
    {
      name: "Assigned Issues",
      count: summary.total_assigned,
      description: "All assigned issues",
      color: "from-[#980101] to-[#FF2C2C]",
      color2: "bg-[#980101]",
    },
    {
      name: "Pending Issues",
      count: summary.pending_count,
      description: "Pending",
      color: "from-[#F5A623] to-[#F8E71C]",
      color2: "bg-[#F5A623]",
    },
    {
      name: "In Progress",
      count: summary.accepted_count,
      description: "Accepted & In Progress",
      color: "from-[#00284B] to-[#0088FF]",
      color2: "bg-[#00284B]",
    },
    {
      name: "Completed",
      count: summary.completed_count,
      description: "Issues Fixed",
      color: "from-[#0D4900] to-[#2DF300]",
      color2: "bg-[#0D4900]",
    },
  ];

  return (
    <>
      <StaffSideNav />
      <BottomNav />
      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] min-h-screen overflow-y-auto">
        <div className="w-full mx-auto">
          {/* header */}
          <div className="w-full bg-violet-500 p-4 sm:p-5  lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* LEFT */}
              <div>
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                  Your Dashboard
                </h1>

                <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                  Welcome back,{" "}
                  {profileData?.name || summary.staff_name || "staff"}!
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mt-2 gap-2 flex flex-wrap justify-center bg-[#F0EEFF] p-4 rounded-2xl">
            {stats?.map((item, index) => (
              <IssueCard key={index} issue={item} />
            ))}
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm p-6 ">
            <div className="flex justify-between items-center mb-6"></div>

            {loading ? (
              <Loader />
            ) : assignedIssues?.length > 0 ? (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="text-  lg font-semibold">Recently Assigned</h2>

                  <a
                    href="/assigned-issues"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View All →
                  </a>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-xs uppercase text-left">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Issue</th>
                        <th className="px-6 py-4 font-semibold">Priority</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {assignedIssues.slice(0, 5).map((issue) => (
                        <tr
                          key={issue.id}
                          className="border-t border-border hover:bg-muted/40 transition-all duration-200"
                        >
                          {/* Title */}
                          <td className="px-6 py-4">
                            <div className="font-medium">
                              {issue?.title || "Untitled Issue"}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              #{issue.issue_id}
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full

                  ${
                    issue?.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : issue?.priority === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }

                  `}
                            >
                              {issue?.priority || "low"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full}`}
                            >
                              {issue?.assignment_status}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4 text-right">
                            <a
                              href={`/tasks/${issue.issue_id}`}
                              className="inline-block px-4 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:opacity-90 transition"
                            >
                              View
                            </a>
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

                <p className="font-semibold text-muted-foreground">
                  No assigned issues
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
