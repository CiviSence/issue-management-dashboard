import { useState } from "react";
import { changePassword } from "../../Utils/auth-api";

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!oldPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (oldPassword === newPassword) {
      setError("New password cannot be identical to your old password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      if (onSuccess) onSuccess("Password changed successfully!");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-dark-border/60 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg">
              <i className="ri-lock-password-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-dark-text">
                Change Password
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                Ensure your account stays secure with a strong password
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text focus:outline-none focus:border-violet-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
              >
                <i className={`ri-eye-${showOld ? "off-" : ""}line`}></i>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
              New Password (Min. 8 characters)
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text focus:outline-none focus:border-violet-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
              >
                <i className={`ri-eye-${showNew ? "off-" : ""}line`}></i>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-dark-text-secondary uppercase tracking-wider block mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-elevated border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-dark-text focus:outline-none focus:border-violet-500 transition"
            />
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
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
