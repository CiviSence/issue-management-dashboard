import { useState, useRef, useEffect } from "react";
import { useOrganization } from "../Context/OrganizationContext";
import OrgChangeRequestModal from "./common/OrgChangeRequestModal";

export const OrganizationSwitcher = ({ className = "" }) => {
  const {
    myOrganizations,
    activeOrganization,
    loadingOrgs,
    switchingOrgId,
    switchActiveOrg,
  } = useOrganization();

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOrg = async (orgId) => {
    if (!orgId || (activeOrganization && (activeOrganization.id === orgId || activeOrganization._id === orgId))) {
      setIsOpen(false);
      return;
    }
    try {
      await switchActiveOrg(orgId);
    } catch (err) {
      console.error("Failed to switch org:", err);
    } finally {
      setIsOpen(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
      case "executive":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "moderator":
      case "staff":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    }
  };

  if (loadingOrgs) {
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border animate-pulse ${className}`}>
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="w-16 sm:w-24 h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  const currentOrgName = activeOrganization?.name || "Select Org";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Active Org Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={switchingOrgId !== null}
        className="group flex items-center justify-between gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gray-100 dark:bg-dark-elevated hover:bg-gray-200/70 dark:hover:bg-dark-border/80 border border-gray-200 dark:border-dark-border transition-all duration-200 shadow-xs text-left max-w-[125px] min-w-0 sm:max-w-[220px]"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200/70 dark:border-indigo-700/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400 font-bold group-hover:scale-105 transition-transform">
            <i className="ri-building-4-line text-xs sm:text-lg"></i>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="hidden sm:flex text-[10px] sm:text-xs font-medium text-gray-500 dark:text-dark-text-muted truncate items-center gap-1">
              Active Context
              {switchingOrgId && <i className="ri-loader-4-line animate-spin text-indigo-500 dark:text-indigo-400"></i>}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-dark-text truncate">
              {currentOrgName}
            </span>
          </div>
        </div>
        <i
          className={`ri-arrow-down-s-line text-gray-400 dark:text-dark-text-muted text-xs sm:text-lg transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        ></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-xl backdrop-blur-xl z-50 overflow-hidden divide-y divide-gray-100 dark:divide-dark-border animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gray-50 dark:bg-dark-elevated/50 flex items-center justify-between">
            <p className="text-[10px] sm:text-[11px] font-semibold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">
              Organizations ({myOrganizations.length})
            </p>
          </div>

          {/* List of Orgs */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
            {myOrganizations.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 dark:text-dark-text-muted text-center">
                No organizations found
              </div>
            ) : (
              myOrganizations.map((item, idx) => {
                const org = item.organization || item;
                const orgId = org.id || org._id;
                const isActive = activeOrganization && (activeOrganization.id === orgId || activeOrganization._id === orgId);
                const isCurrentlySwitching = switchingOrgId === orgId;

                return (
                  <button
                    key={orgId || idx}
                    type="button"
                    onClick={() => handleSelectOrg(orgId)}
                    disabled={isCurrentlySwitching}
                    className={`w-full flex items-center justify-between p-2 sm:p-2.5 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-900 dark:text-indigo-200"
                        : "hover:bg-gray-100/70 dark:hover:bg-dark-elevated text-gray-700 dark:text-dark-text border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 dark:bg-dark-elevated text-gray-600 dark:text-dark-text-secondary border border-gray-200 dark:border-dark-border"
                        }`}
                      >
                        {org.name ? org.name.charAt(0).toUpperCase() : "O"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {org.name || "Organization"}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-gray-400 dark:text-dark-text-muted truncate">
                          {org.code ? `Code: ${org.code}` : org.domain || "Campus Context"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1">
                      {item.role && (
                        <span
                          className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full border ${getRoleBadgeColor(
                            item.role
                          )}`}
                        >
                          {item.role}
                        </span>
                      )}
                      {isActive && (
                        <i className="ri-check-line text-indigo-600 dark:text-indigo-400 text-sm sm:text-base"></i>
                      )}
                      {isCurrentlySwitching && (
                        <i className="ri-loader-4-line text-indigo-600 dark:text-indigo-400 text-sm sm:text-base animate-spin"></i>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Request Org Change Option */}
          <div className="p-1.5 bg-gray-50/50 dark:bg-dark-elevated/30">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              <i className="ri-add-circle-line text-sm"></i>
              Request Org Change / Transfer
            </button>
          </div>
        </div>
      )}

      {/* Org Change Request Modal */}
      <OrgChangeRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
