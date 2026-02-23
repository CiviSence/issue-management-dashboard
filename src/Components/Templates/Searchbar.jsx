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
    sm:w-[90%]
    md:w-[70%]
    lg:w-[50%]
    xl:w-[40%]
    2xl:w-[35%]
    rounded-full
    p-1.5
    sm:p-2
    flex
    items-center
    justify-between
    gap-2
    sm:gap-3
    shadow-sm
    border
    border-gray-100
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
      bg-[#F0EEFF]
      px-3
      sm:px-4
      py-2
      sm:py-2.5
      rounded-full
      focus:outline-none
      focus:ring-2
      focus:ring-violet-500/20
      text-sm
      placeholder:text-gray-400
    "
  />

  {/* Right Icons */}
  <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
    {/* notification icon - hidden on smallest screens */}
    <button 
      className="hidden sm:block p-1 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Notifications"
    >
      <i className="ri-notification-3-line text-lg sm:text-xl text-[#aaaaaa]"></i>
    </button>
    
    {/* theme toggle icon - hidden on smallest screens */}
    <button 
      className="hidden sm:block p-1 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      <i className="ri-moon-line text-lg sm:text-xl text-[#aaaaaa]"></i>
    </button>
    <button 
      className=" sm:hidden pr-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      <i className="ri-search-line text-xl text-[#aaaaaa]"></i>
    </button>

    

    {/* User */}
    <Link
      to="/profile"
      className="hidden sm:block shrink-0 rounded-full bg-amber-300 h-8 w-8 sm:h-9 sm:w-9 text-center overflow-hidden hover:ring-2 hover:ring-violet-500/30 transition-all"
    >
      <img
        src={profileData?.avatar_url}
        alt="Profile"
        className="w-full h-full rounded-full border border-violet-600 object-cover"
      />
    </Link>
  </div>

  {/* Search Results Dropdown */}
  {showResults && query && (
    <div 
      className="
        absolute 
        top-12 
        sm:top-14 
        left-0 
        right-0
        sm:right-auto
        sm:w-[80%]
        md:w-[75%]
        bg-white 
        shadow-lg 
        rounded-xl 
        max-h-60 
        overflow-y-auto 
        z-50
        border
        border-gray-100
      "
    >
      {filteredIssues.length > 0 ? (
        filteredIssues.map((issue) => (
          <div
            key={issue.id}
            onClick={() => handleSelect(issue.id)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
          >
            <p className="font-medium text-sm text-gray-900">{issue.title}</p>
            <p className="text-gray-500 text-xs truncate mt-0.5">
              {issue.description}
            </p>
          </div>
        ))
      ) : (
        <p className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-500">No issues found</p>
      )}
    </div>
  )}
</div>
  );
};

export default Searchbar;
