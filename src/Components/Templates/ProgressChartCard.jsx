import IssuesBarChart from "./IssueBarChart";
import ProgressBar from "./ProgressBar";

const issuesData = [
  { name: "Open Issues", value: 200, color: "#FCD34D" }, // yellow
  { name: "In Progress", value: 100, color: "#60A5FA" }, // blue
  { name: "Resolved", value: 56, color: "#4ADE80" }, // green
  { name: "Spam", value: 70, color: "#FF4954" }, // red
];

const totalIssues = issuesData.reduce((a, b) => a + b.value, 0);

const ProgressChartCard = () => {
  return (
   <div className="bg-white rounded-xl p-6 w-[50%]">
  {/* Header */}
  <div className="flex justify-between items-center">
    <h2 className="font-semibold">Progress Chart</h2>
    <span className="text-3xl font-bold">{totalIssues}</span>
  </div>

  {/* Progress bar */}
  <div className="mt-4">
    <ProgressBar issuesData={issuesData} totalIssues={totalIssues} />
  </div>

  {/* Bar chart */}
  <div className="mt-6">
    <IssuesBarChart issuesData={issuesData} />
  </div>
</div>

  );
};

export default ProgressChartCard;