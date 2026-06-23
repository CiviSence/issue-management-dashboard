const locations = [
  { name: "Boys Hostel", issues: 52 },
  { name: "Girls Hostel", issues: 32 },
  { name: "Admin Building", issues: 25 },
  { name: "Type - C", issues: 10 },
  { name: "Type - A", issues: 3 },
];

// Badge color logic
const getBadgeColor = (count) => {
  if (count >= 40) return "bg-red-500";
  if (count >= 25) return "bg-yellow-400";
  if (count >= 10) return "bg-amber-400";
  return "bg-green-500";
};

const TopLocations = () => {
  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xsw-full lg:w-[48%] h-[300px] sm:h-[400px]  sm:p-6">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Top Locations
      </h2>

      {/* Header Row */}
      <div className="flex justify-between text-m text-gray-400 mt-4 pb-2 border-b">
        <span>Location</span>
        <span>Issues</span>
      </div>

      {/* List */}
      <div className="mt-3 space-y-5">
        {locations.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <p className="text-sm sm:text-base font-medium text-gray-800">
              {item.name}
            </p>

            <span
              className={`text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-full ${getBadgeColor(
                item.issues
              )}`}
            >
              {item.issues} issues
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopLocations;
