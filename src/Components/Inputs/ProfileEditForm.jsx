import { useState } from "react";
import { changePassword } from "../../Utils/auth-api";
import { uploadAvatar } from "../../Utils/profile-api";
import defaultPfpFemale from "../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../assets/default-pfp/default-pfp-male.svg";

const getDefaultAvatar = (gender) => {
  const g = gender?.toLowerCase();
  return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};

// ─── Reusable Field Components ───────────────────────────────────────────────

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
  placeholder = "",
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 transition-all"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none cursor-pointer"
    >
      {children}
    </select>
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-2 pt-2 pb-1">
    <i className={`${icon} text-violet-600`}></i>
    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
      {title}
    </span>
    <div className="flex-1 h-px bg-gray-100 ml-1"></div>
  </div>
);

// ─── Main Edit Form ──────────────────────────────────────────────────────────

const ProfileEditForm = ({ profile, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const role = profile?.role?.toLowerCase();

  const getInitialFormData = () => {
    const baseData = {
      name: profile.name,
      avatar_url: profile.avatar_url,
      phone_number: profile.phone_number,
      gender: profile.gender,
      date_of_birth: profile.date_of_birth,
      address: profile.address,
      pincode: profile.pincode,
    };

    if (role === "student") {
      return {
        ...baseData,
        registration_number: profile.registration_number,
        department: profile.department,
        course: profile.course,
        year: profile.year,
        semester: profile.semester,
        is_hosteler: profile.is_hosteler,
        hostel_name: profile.hostel_name,
        room_number: profile.room_number,
      };
    } else if (role === "staff") {
      return {
        ...baseData,
        designation: profile.designation,
      };
    } else {
      // Admin — just base data
      return baseData;
    }
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const data = await uploadAvatar(file);
      setFormData((prev) => ({ ...prev, avatar_url: data.url }));
      setSuccess("Profile picture updated!");
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (activeTab === "profile") {
        await onSave(formData);
        setSuccess("Profile updated successfully!");
      } else {
        if (passwordData.new_password !== passwordData.confirm_password) {
          throw new Error("New passwords do not match");
        }
        if (passwordData.new_password.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
        await changePassword({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        });
        setSuccess("Password updated. Other logged-in sessions have been revoked.");
        setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
      }
    } catch (err) {
      setError(err.message || "Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1010] overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-4">

        {/* ── Modal Header ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-xl">
              <i className="ri-user-settings-line text-violet-600 text-lg"></i>
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">
                {activeTab === "profile" ? "Edit Profile" : "Security Settings"}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                {role?.charAt(0).toUpperCase() + role?.slice(1)} Account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="flex border-b border-gray-100 px-6 gap-1">
          {[
            { key: "profile", label: "Edit Profile", icon: "ri-user-3-line" },
            { key: "security", label: "Security & Password", icon: "ri-shield-keyhole-line" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.key
                  ? "text-violet-600 border-violet-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
              onClick={() => {
                setActiveTab(tab.key);
                setError(null);
                setSuccess(null);
              }}
            >
              <i className={`${tab.icon} text-base`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Alerts ────────────────────────────────────────────── */}
        {(error || success) && (
          <div className="px-6 pt-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm border border-red-100">
                <i className="ri-error-warning-line text-lg shrink-0"></i>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm border border-emerald-100">
                <i className="ri-checkbox-circle-line text-lg shrink-0"></i>
                {success}
              </div>
            )}
          </div>
        )}

        {/* ── Form Body ─────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-5"
        >
          {activeTab === "profile" ? (
            <>
              {/* ── Avatar Section ──────────────────────────────── */}
              <SectionTitle icon="ri-image-line" title="Profile Picture" />
              <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="relative shrink-0">
                  <img
                    src={formData.avatar_url || getDefaultAvatar(formData.gender)}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                    onError={(e) => (e.target.src = getDefaultAvatar(formData.gender))}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                      <i className="ri-loader-4-line text-violet-600 animate-spin text-xl"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    Upload new photo
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    JPG, PNG or GIF · Max 5MB
                  </p>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm shadow-violet-200 active:scale-95">
                    <i className="ri-upload-2-line"></i>
                    {uploading ? "Uploading..." : "Choose Photo"}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* ── Basic Info ──────────────────────────────────── */}
              <SectionTitle icon="ri-user-3-line" title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <InputField
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </SelectField>
                <InputField
                  label="Date of Birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  type="date"
                />
              </div>

              {/* ── Address ─────────────────────────────────────── */}
              <SectionTitle icon="ri-map-pin-line" title="Address" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                  />
                </div>
                <InputField
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                />
              </div>

              {/* ── Staff-specific: Professional Details ────────── */}
              {role === "staff" && (
                <>
                  <SectionTitle icon="ri-briefcase-4-line" title="Professional Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <InputField
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Assistant Professor"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ── Student-specific: Academic Details ──────────── */}
              {role === "student" && (
                <>
                  <SectionTitle icon="ri-graduation-cap-line" title="Academic Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <InputField
                        label="Registration Number"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleChange}
                        placeholder="e.g. 23105165025"
                        disabled
                      />
                    </div>
                    <SelectField
                      label="Department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      <option value="CSE">Computer Science (CSE)</option>
                      <option value="ECE">Electronics (ECE)</option>
                      <option value="EEE">Electrical (EEE)</option>
                      <option value="ME">Mechanical (ME)</option>
                      <option value="CE">Civil (CE)</option>
                    </SelectField>
                    <SelectField
                      label="Course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                    >
                      <option value="">Select Course</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                    </SelectField>
                    <SelectField
                      label="Year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </SelectField>
                    <SelectField
                      label="Semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={String(s)}>
                          Semester {s}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  {/* ── Hostel Details ───────────────────────────── */}
                  <SectionTitle icon="ri-hotel-line" title="Hostel Details" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-violet-50 hover:border-violet-200 transition-all">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            formData.is_hosteler
                              ? "bg-violet-600 border-violet-600"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.is_hosteler && (
                            <i className="ri-check-line text-white text-xs font-black"></i>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          name="is_hosteler"
                          checked={formData.is_hosteler || false}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            I am a Hosteler
                          </p>
                          <p className="text-xs text-gray-400">
                            Check if you reside in the college hostel
                          </p>
                        </div>
                      </label>
                    </div>

                    {formData.is_hosteler && (
                      <>
                        <SelectField
                          label="Hostel Name"
                          name="hostel_name"
                          value={formData.hostel_name}
                          onChange={handleChange}
                        >
                          <option value="">Select Hostel</option>
                          <option value="Boys">Boys Hostel</option>
                          <option value="Girls">Girls Hostel</option>
                        </SelectField>
                        <InputField
                          label="Room Number"
                          name="room_number"
                          value={formData.room_number}
                          onChange={handleChange}
                          placeholder="e.g. 101"
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            /* ── Security Tab ───────────────────────────────────── */
            <div className="space-y-5 max-w-md mx-auto">
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <i className="ri-information-line text-amber-600 text-xl shrink-0"></i>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  Choose a strong password with at least 8 characters, including
                  numbers and symbols.
                </p>
              </div>

              <div className="relative">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="old_password"
                      value={passwordData.old_password}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Enter current password"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className={showOldPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter new password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={showNewPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                  </button>
                </div>
                {/* Password strength indicator */}
                {passwordData.new_password && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map((i) => {
                      const len = passwordData.new_password.length;
                      const strength =
                        len >= 12 ? 4 : len >= 10 ? 3 : len >= 8 ? 2 : 1;
                      return (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength
                              ? strength === 1
                                ? "bg-red-400"
                                : strength === 2
                                ? "bg-amber-400"
                                : strength === 3
                                ? "bg-blue-400"
                                : "bg-emerald-500"
                              : "bg-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Repeat new password"
                  className={`border rounded-xl px-4 py-3 text-sm outline-none bg-gray-50 focus:bg-white focus:ring-2 focus:border-transparent transition-all ${
                    passwordData.confirm_password &&
                    passwordData.new_password !== passwordData.confirm_password
                      ? "border-red-300 focus:ring-red-400"
                      : "border-gray-200 focus:ring-violet-500"
                  }`}
                />
                {passwordData.confirm_password &&
                  passwordData.new_password !== passwordData.confirm_password && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <i className="ri-close-circle-line"></i>
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>
          )}
        </form>

        {/* ── Footer Buttons ────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl font-bold text-sm transition-all"
            disabled={loading || uploading}
          >
            {success && activeTab === "security" ? "Close" : "Cancel"}
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={loading || uploading}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                Saving...
              </>
            ) : uploading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                Uploading...
              </>
            ) : activeTab === "profile" ? (
              <>
                <i className="ri-save-3-line"></i>
                Save Changes
              </>
            ) : (
              <>
                <i className="ri-lock-password-line"></i>
                Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
