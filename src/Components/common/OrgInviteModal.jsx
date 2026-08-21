import { useState } from "react";
import { inviteUserToOrg } from "../../Utils/organization-api";

const OrgInviteModal = ({ isOpen, onClose, orgName, orgId }) => {
  const [roleToGrant, setRoleToGrant] = useState("citizen");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedInvite, setGeneratedInvite] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await inviteUserToOrg({
        role_to_grant: roleToGrant,
        expires_in_days: Number(expiresInDays),
      });
      setGeneratedInvite(res);
    } catch (err) {
      setError(err.message || "Failed to generate invite token");
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = generatedInvite?.token
    ? `${window.location.origin}/register?invite=${generatedInvite.token}&org=${orgId || ""}`
    : "";

  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-dark-border/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg">
              <i className="ri-user-add-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-dark-text">
                Generate Organization Invite
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                Invite members to join {orgName || "your organization"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setGeneratedInvite(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-elevated transition"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
            <i className="ri-error-warning-line text-sm shrink-0"></i>
            <p>{error}</p>
          </div>
        )}

        {!generatedInvite ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
                Role to Grant
              </label>
              <select
                value={roleToGrant}
                onChange={(e) => setRoleToGrant(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text focus:outline-none focus:border-violet-500 transition"
              >
                <option value="citizen">Student / Citizen Member</option>
                <option value="official">Staff / Official Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
                Expiration (Days)
              </label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text focus:outline-none focus:border-violet-500 transition"
              >
                <option value={1}>1 Day</option>
                <option value={3}>3 Days</option>
                <option value={7}>7 Days (Recommended)</option>
                <option value={14}>14 Days</option>
                <option value={30}>30 Days</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-elevated rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading && <i className="ri-loader-4-line animate-spin"></i>}
                Create Invite Link
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
              <i className="ri-checkbox-circle-fill text-base shrink-0"></i>
              <div>
                <p className="font-bold">Invite Generated Successfully!</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Grants <strong>{generatedInvite.role_to_grant}</strong> role • Expires {new Date(generatedInvite.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
                Shareable Invite Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl text-xs font-mono text-gray-800 dark:text-dark-text select-all"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  <i className={copied ? "ri-check-line" : "ri-file-copy-line"}></i>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
                Raw Invite Token
              </label>
              <div className="p-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl font-mono text-xs text-gray-600 dark:text-dark-text-secondary break-all">
                {generatedInvite.token}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setGeneratedInvite(null)}
                className="px-4 py-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-xl transition"
              >
                Create Another
              </button>
              <button
                type="button"
                onClick={() => {
                  setGeneratedInvite(null);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-white dark:bg-dark-elevated rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgInviteModal;
