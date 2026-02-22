import { useMemo, useState } from "react";
import { useIssues } from "../../Context/IssueContext";
import { useUser } from "../../Context/ProfileContext";
import { Link, useNavigate } from "react-router-dom";

const Searchbar = () => {
  const { profileData } = useUser();
  const { issues } = useIssues();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  //  Filter issues
  const filteredIssues = useMemo(() => {
    if (!query.trim()) return [];

    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.description?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, issues]);

  const handleSelect = (id) => {
    setQuery("");
    setShowResults(false);
    navigate(`/issues/${id}`);
  };

  return (
    <div
      className="
        bg-white
        relative
        w-full
        md:w-[60%]
        lg:w-[40%]
        xl:w-[35%]
        rounded-full
        p-2
        flex
        items-center
        justify-between
        gap-3
      "
    >
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search issues"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        className="
          
          w-full
          md:w-[55%]
          bg-[#F0EEFF]
          px-4
          py-2
          rounded-full
          focus:outline-none
          text-sm
        "
      />

      {/* Right Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* notification icon */}
        <i className="ri-notification-3-line text-lg sm:text-xl text-[#aaaaaa]"></i>
        {/* theme toggle icon */}
        <i className="ri-moon-line text-lg sm:text-xl text-[#aaaaaa]"></i>

        {/* User */}
        <Link
          to="/profile"
          className="rounded-full bg-amber-300 h-9 w-9 mr-1 text-center"
        >
          <img
            src={profileData?.avatar_url}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-violet-600 object-cover"
          />
        </Link>
      </div>
      {showResults && query && (
        <div className="absolute top-14 left-0 w-[70%] bg-white shadow-lg rounded-xl max-h-60 overflow-y-auto z-50">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => handleSelect(issue.id)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b text-sm"
              >
                <p className="font-medium">{issue.title}</p>
                <p className="text-gray-500 text-xs truncate">
                  {issue.description}
                </p>
              </div>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-gray-500">No issues found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
