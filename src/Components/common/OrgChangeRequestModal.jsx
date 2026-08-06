import { useState, useEffect } from "react";
import { submitOrgChangeRequest, listOrganizations } from "../../Utils/organization-api";

const OrgChangeRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const [targetOrgId, setTargetOrgId] = useState("");
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [fetchingOrgs, setFetchingOrgs] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      const loadOrgs = async () => {
        try {
          setFetchingOrgs(true);
          const orgs = await listOrganizations();
          if (isMounted && Array.isArray(orgs)) {
            setAvailableOrgs(orgs);
          }
        } catch (e) {
          console.warn("Failed to load public orgs list", e);
        } finally {
          if (isMounted) setFetchingOrgs(false);
        }
      };
      loadOrgs();
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetOrgId.trim()) {
      setError("Please specify the target organization ID or code.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Backend POST /api/organizations/request-change accepts new_organization_id & reason
      const parsedId = isNaN(Number(targetOrgId)) ? targetOrgId.trim() : Number(targetOrgId);
      await submitOrgChangeRequest({
        new_organization_id: parsedId,
        organization_id: parsedId,
        target_organization_id: parsedId,
        reason: reason.trim() || "Requesting organization change/transfer",
      });
      setSuccessMsg("Organization change request submitted successfully!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        setTargetOrgId("");
        setReason("");
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to submit organization change request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
              <i className="ri-arrow-left-right-line text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Organization Change Request</h3>
              <p className="text-xs text-gray-500">Request to join or switch organization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-error-warning-fill text-base shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-checkbox-circle-fill text-base shrink-0"></i>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Select Target Organization <span className="text-rose-500">*</span>
            </label>
            {availableOrgs.length > 0 ? (
              <select
                required
                value={targetOrgId}
                onChange={(e) => setTargetOrgId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 text-gray-900 dark:bg-dark-elevated border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
              >
                <option value="">-- Choose an Organization --</option>
                {availableOrgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} {org.code ? `(${org.code})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={targetOrgId}
                onChange={(e) => setTargetOrgId(e.target.value)}
                placeholder={fetchingOrgs ? "Loading available organizations..." : "e.g. 2 or ORG-102"}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason for Request
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you wish to switch or join this organization..."
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-dark-border rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl transition-colors shadow-md shadow-violet-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i> Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrgChangeRequestModal;
