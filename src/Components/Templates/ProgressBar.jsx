const ProgressBar = ({ issuesData = [], totalIssues = 0 }) => {
  if (!issuesData.length || !totalIssues) return null;

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
      {issuesData.map((item) => (
        <div
          key={item.name}
          style={{
            width: `${(item.value / totalIssues) * 100}%`,
            backgroundColor: item.color,
          }}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
