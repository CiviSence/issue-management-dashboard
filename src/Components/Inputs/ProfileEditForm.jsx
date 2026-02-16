import { useState } from "react";
import { changePassword } from "../../Utils/auth-api";
import { uploadAvatar } from "../../Utils/profile-api";
import defaultProfile from "../../assets/default-avatar.jpg";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600 disabled:bg-gray-100 disabled:text-gray-500"
    />
  </div>
);

const ProfileEditForm = ({ profile, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'security'

  const [formData, setFormData] = useState({
    name: profile.name,
    avatar_url: profile.avatar_url,
    registration_number: profile.registration_number,
    gender: profile.gender,
    date_of_birth: profile.date_of_birth,
    phone_number: profile.phone_number,
    pincode: profile.pincode,
    department: profile.department,
    course: profile.course,
    year: profile.year,
    semester: profile.semester,
    designation: profile.designation,
    is_hosteler: profile.is_hosteler,
    hostel_name: profile.hostel_name,
    room_number: profile.room_number,
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

    // Optional: Check file type/size locally
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const data = await uploadAvatar(file);
      setFormData((prev) => ({ ...prev, avatar_url: data.url }));
      setSuccess("Image uploaded successfully!");
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (activeTab === "profile") {
        await onSave(formData);
      } else {
        if (passwordData.new_password !== passwordData.confirm_password) {
          throw new Error("New passwords do not match");
        }
        await changePassword({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        });
        setSuccess("Password changed successfully!");
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch (err) {
      setError(err.message || "Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 font-semibold text-center ${activeTab === "profile" ? "text-violet-600 border-b-2 border-violet-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setActiveTab("profile");
              setError(null);
              setSuccess(null);
            }}
          >
            Edit Profile
          </button>
          <button
            className={`flex-1 py-4 font-semibold text-center ${activeTab === "security" ? "text-violet-600 border-b-2 border-violet-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setActiveTab("security");
              setError(null);
              setSuccess(null);
            }}
          >
            Security & Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "profile"
                ? "Update Information"
                : "Change Password"}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {activeTab === "profile" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Avatar Preview Section */}
              <div className="col-span-1 md:col-span-2 flex items-center gap-4 mb-2">
                <img
                  src={formData.avatar_url || "/default-avatar.png"}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  onError={(e) => (e.target.src = defaultProfile)}
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex gap-2 items-center">
                    <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                      {uploading ? "Uploading..." : "Choose File"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </label>
                    <span className="text-xs text-gray-500">
                      Max 5MB (JPEG, PNG, GIF)
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <InputField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <InputField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />

              <InputField
                label="Date of Birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                type="date"
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="EEE">Electrical (EEE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="CE">Civil (CE)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Year
                </label>
                <select
                  name="year"
                  value={formData.year || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_hosteler"
                    checked={formData.is_hosteler || false}
                    onChange={handleChange}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Is Hosteler
                  </span>
                </label>
              </div>

              {formData.is_hosteler && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Hostel Name
                    </label>
                    <select
                      name="hostel_name"
                      value={formData.hostel_name || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-violet-600"
                    >
                      <option value="">Select Hostel</option>
                      <option value="Boys Hostel 1">Boys Hostel</option>
                      <option value="Girls Hostel 1">Girls Hostel</option>
                    </select>
                  </div>

                  <InputField
                    label="Room Number"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                  />
                </>
              )}
              <div className="col-span-1 md:col-span-2">
                <InputField
                  label="Designation (Staff Only)"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <InputField
                label="Current Password"
                name="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                required
              />
              <InputField
                label="New Password"
                name="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
              <InputField
                label="Confirm New Password"
                name="confirm_password"
                type="password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              disabled={loading || uploading}
            >
              {success ? "Close" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-70"
              disabled={loading || uploading}
            >
              {loading
                ? "Saving..."
                : activeTab === "profile"
                  ? "Save Changes"
                  : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;
