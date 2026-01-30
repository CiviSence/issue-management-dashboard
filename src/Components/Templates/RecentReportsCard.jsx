const RecentReportsCard = ({ recentReports }) => {
  return (
    <div className="bg-white rounded-lg p-6 w-full lg:w-[48%] overflow-x-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#363434] mb-5">
        Recent Reports
      </h2>

      <table className="w-full text-left min-w-[500px]">
        <thead>
          <tr>
            <th className="pb-4">Issue</th>
            <th className="pb-4">Location</th>
            <th className="pb-4">Status</th>
            <th className="pb-4">Reported</th>
          </tr>
        </thead>

        <tbody>
          {recentReports.map((report) => (
            <tr key={report.id} className="border-t">
              <td className="py-4 font-semibold">{report.issue}</td>
              <td className="py-4 text-gray-500">{report.location}</td>
              <td className="py-4">{report.status}</td>
              <td className="py-4">{report.reported}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentReportsCard