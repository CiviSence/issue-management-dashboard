import { useState, useEffect, useCallback } from "react";
import { getMyOrganizations, switchOrganization } from "../Utils/organization-api";
import { getMyProfile } from "../Utils/profile-api";
import { setSession } from "../Utils/auth-utils";
import { OrganizationContext } from "./OrganizationContext.js";

export const OrganizationProvider = ({ children }) => {
  const [myOrganizations, setMyOrganizations] = useState([]);
  const [activeOrgItem, setActiveOrgItem] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [switchingOrgId, setSwitchingOrgId] = useState(null);
  const [error, setError] = useState(null);

  const fetchMyOrganizations = useCallback(async (preferredActiveId = null) => {
    try {
      setLoadingOrgs(true);
      setError(null);
      const data = await getMyOrganizations();
      const orgList = Array.isArray(data) ? data : (data?.organizations || []);
      setMyOrganizations(orgList);

      // Resolve active organization ID from preferred argument or profile data
      let activeOrgId = preferredActiveId;
      if (!activeOrgId) {
        try {
          const profile = await getMyProfile();
          activeOrgId = profile?.active_organization_id;
        } catch {
          // fallback
        }
      }

      // Find active item matching activeOrgId
      let activeItem = null;
      if (activeOrgId) {
        activeItem = orgList.find((item) => {
          const id = item.organization?.id || item.id || item._id;
          return id === activeOrgId;
        });
      }

      // Fallback: match by is_active flag or default to first organization
      if (!activeItem) {
        activeItem =
          orgList.find(
            (item) => item.is_active || item.organization?.is_active
          ) || orgList[0] || null;
      }

      setActiveOrgItem(activeItem);
    } catch (err) {
      console.error("Failed to fetch user organizations:", err);
      setError(err.message || "Failed to load organizations");
    } finally {
      setLoadingOrgs(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrganizations();
  }, [fetchMyOrganizations]);

  const switchActiveOrg = async (targetOrgId) => {
    if (!targetOrgId || switchingOrgId) return;

    try {
      setSwitchingOrgId(targetOrgId);
      setError(null);

      // Optimistically update active org item in local state
      const optimisticItem = myOrganizations.find((item) => {
        const id = item.organization?.id || item.id || item._id;
        return id === targetOrgId;
      });
      if (optimisticItem) {
        setActiveOrgItem(optimisticItem);
      }

      // Call API endpoint POST /api/organizations/switch
      const tokenData = await switchOrganization(targetOrgId);

      // Update tokens in persistent storage & memory cache
      if (tokenData?.access_token) {
        setSession(tokenData.access_token, null, tokenData.refresh_token);
      }

      // Re-fetch user profile to sync updated active_organization_id & role
      try {
        const freshProfile = await getMyProfile();
        setSession(null, freshProfile);
      } catch (profErr) {
        console.warn("Profile sync after org switch failed:", profErr);
      }

      // Re-fetch user organizations list with targetOrgId preferred
      await fetchMyOrganizations(targetOrgId);

      // Trigger soft window refresh if needed so active pages reload their org-scoped queries
      window.dispatchEvent(new Event("organizationSwitched"));

      return true;
    } catch (err) {
      console.error("Error switching organization context:", err);
      setError(err.message || "Failed to switch organization context");
      throw err;
    } finally {
      setSwitchingOrgId(null);
    }
  };

  const activeOrganization = activeOrgItem?.organization || activeOrgItem;

  return (
    <OrganizationContext.Provider
      value={{
        myOrganizations,
        activeOrgItem,
        activeOrganization,
        loadingOrgs,
        switchingOrgId,
        error,
        fetchMyOrganizations,
        switchActiveOrg,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
