import { useMemo, useState, useEffect, useRef } from "react";
import { useIssues } from "../../Context/IssueContext.js";
import { useUser } from "../../Context/ProfileContext";
import { Link, useNavigate } from "react-router-dom";
import defaultPfpFemale from "../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../assets/default-pfp/default-pfp-male.svg";

const TopBar = ({ title }) => {
  const { profileData } = useUser();
  const { issues } = useIssues();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIssues = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(q) ||
        issue.description?.toLowerCase().includes(q),
    );
  }, [query, issues]);

  const handleSelect = (issue) => {
    setQuery("");
    setShowResults(false);
    navigate(`/issues/${issue.id}`, { state: issue });
  };

  const avatarSrc =
    profileData?.avatar_url ||
    (["female", "f", "woman"].includes(profileData?.gender?.toLowerCase())
      ? defaultPfpFemale
      : defaultPfpMale);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#ffffff] border-b border-gray-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-gray-900 font-semibold text-lg sm:text-xl truncate shrink-0">
          {title}
        </h1>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div
            ref={searchRef}
            className={`${isMobileSearchOpen ? "absolute inset-x-0 top-0 bg-white z-50 px-4 py-3 flex items-center gap-3 border-b border-gray-200/80" : "relative hidden sm:block"}`}
          >
            {isMobileSearchOpen && (
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setQuery("");
                }}
                className="shrink-0 p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-arrow-left-line text-lg"></i>
              </button>
            )}

            <div className="relative flex-1 sm:w-64 lg:w-80">
              <i className="sm:hidden ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search issues..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                className=" sm:hidden w-full bg-gray-100 hover:bg-gray-200/70 focus:bg-white pl-9 pr-4 py-2 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />

              {/* Results Dropdown */}
              {showResults && query && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto py-1">
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => handleSelect(issue)}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {issue.title}
                        </p>
                        <p className="text-gray-500 text-xs truncate mt-0.5">
                          {issue.description}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-400">
                      No issues found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="sm:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-search-line text-lg"></i>
          </button>

          {/* Refresh */}
          <button
            onClick={() => window.location.reload()}
            className="hidden lg:flex p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <i className="ri-refresh-line text-lg"></i>
          </button>

          {/* Profile */}
          <Link
            to="/profile"
            className="shrink-0 w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-gray-200 transition-all"
          >
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;