import { useEffect, useState, useRef, useCallback } from "react";
import StudentSideNav from "./StudentSideNav";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import { toast } from "react-toastify";
import { useUser } from "../../../Context/ProfileContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  getMyIssues,
  createMyIssue,
  updateMyIssue,
  deleteMyIssue,
  uploadMultipleMedia,
} from "../../../Utils/issuesStudent";
import defaultAvatar from "../../../assets/default-avatar.jpg";

// Helpers

const formatTime = (dateString) => {
  const date = new Date(dateString + (dateString.endsWith("Z") ? "" : "Z"));
  const now = new Date();
  const secs = Math.floor((now - date) / 1000);
  if (secs < 60) return "Just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const STATUS_STYLE = {
  new: {
    bar: "bg-violet-500",
    badge: "bg-violet-50 text-violet-600 border-violet-200",
    dot: "bg-violet-500",
    label: "New",
  },
  acknowledged: {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
    label: "Acknowledged",
  },
  in_progress: {
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    label: "In Progress",
  },
  resolved: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Resolved",
  },
  closed: {
    bar: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    label: "Closed",
  },
};

const PRIORITY_STYLE = {
  low: "bg-gray-50 text-gray-500 border-gray-200",
  medium: "bg-orange-50 text-orange-600 border-orange-200",
  high: "bg-rose-50 text-rose-600 border-rose-200",
  critical: "bg-red-50 text-red-700 border-red-200 animate-pulse",
};

const CATEGORIES = ["security", "cleanliness", "maintenance", "infrastructure", "facilities", "other"];
const BUILDINGS = [
  ["boys-hostel", "Boys Hostel"],
  ["girls-hostel", "Girls Hostel"],
  ["admin-building", "Admin Building"],
  ["faculty-building", "Faculty Building"],
  ["campus", "Campus"],
  ["other", "Other"],
];

const EMPTY_FORM = {
  title: "",
  description: "",
  main_category: "",
  sub_category: "",
  location_address: "",
  location_building: "",
  location_ward: "",
};

// Issue Form Modal

const MediaUploadZone = ({ newFiles, setNewFiles, existingUrls, setExistingUrls }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback((incoming) => {
    const valid = Array.from(incoming).filter((f) =>
      f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (valid.length + newFiles.length + existingUrls.length > 6) {
      toast.warning("Max 6 media files allowed");
      return;
    }
    const withPreview = valid.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setNewFiles((prev) => [...prev, ...withPreview]);
  }, [newFiles, existingUrls]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeNew = (idx) => {
    setNewFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const removeExisting = (url) =>
    setExistingUrls((prev) => prev.filter((u) => u !== url));

  const isVideoUrl = (url) => /\.(mp4|mov|webm)(\?.*)?$/i.test(url);

  const total = existingUrls.length + newFiles.length;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Media <span className="text-gray-400 text-xs">(images / videos, max 6)</span>
      </label>

      {/* Drop zone */}
      {total < 6 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-all mb-3
            ${dragging ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-400 hover:bg-violet-50/40"}`}
        >
          <i className="ri-image-add-line text-2xl text-violet-400 mb-1 block" />
          <p className="text-xs text-gray-500">
            Drag & drop or <span className="text-violet-600 font-medium">click to browse</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, MP4 — up to 6 files</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
      )}

      {/* Previews grid */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingUrls.map((url) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
              {isVideoUrl(url) ? (
                <video src={url} className="w-full h-full object-cover" />
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-all"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>
          ))}
          {newFiles.map((file, i) => (
            <div key={file.preview} className="relative aspect-square rounded-lg overflow-hidden border-2 border-violet-300 group">
              {file.type.startsWith("video") ? (
                <video src={file.preview} className="w-full h-full object-cover" />
              ) : (
                <img src={file.preview} alt="" className="w-full h-full object-cover" />
              )}
              {/* NEW badge */}
              <span className="absolute top-1 left-1 bg-violet-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-md transition-all"
                >
                  <i className="ri-close-line" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const IssueFormModal = ({ initial, onClose, onSaved }) => {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? {
        title: initial.title || "",
        description: initial.description || "",
        main_category: initial.main_category || "",
        sub_category: initial.sub_category || "",
        location_address: initial.location_address || "",
        location_building: initial.location_building || "",
        location_ward: initial.location_ward || "",
      }
      : EMPTY_FORM
  );
  // Media state
  const [existingUrls, setExistingUrls] = useState(
    (initial?.media_urls || []).filter((u) => u && u !== "string")
  );
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.warning("Please enter a title");
    if (!form.description.trim() || form.description.length < 10)
      return toast.warning("Description must be at least 10 characters");
    if (!form.location_building) return toast.warning("Please select a building");
    if (!form.main_category) return toast.warning("Please select a category");

    setSubmitting(true);
    try {
      // 1. Upload new files first
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        setUploading(true);
        try {
          uploadedUrls = await uploadMultipleMedia(newFiles);
        } catch (uploadErr) {
          toast.error("Media upload failed: " + (uploadErr.message || "Please try again"));
          setUploading(false);
          setSubmitting(false);
          return;
        }
        setUploading(false);
      }

      // 2. Combine existing (kept) + newly uploaded
      const media_urls = [...existingUrls, ...uploadedUrls];

      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        sub_category: form.sub_category || "general",
        media_urls,
      };

      if (isEdit) {
        const updated = await updateMyIssue(initial.id, payload);
        onSaved(updated, "edit");
        toast.success("Issue updated successfully!");
      } else {
        const created = await createMyIssue(payload);
        onSaved(created, "create");
        toast.success("Issue reported successfully!");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isEdit ? "Edit Issue" : "Report New Issue"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? "Update the details below" : "Fill in the details below"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <Field label="Issue Title">
            <input
              value={form.title}
              onChange={set("title")}
              className={inputCls}
              placeholder="e.g. Broken projector in Room 301"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Main Category">
              <select value={form.main_category} onChange={set("main_category")} className={inputCls}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Sub Category">
              <input
                value={form.sub_category}
                onChange={set("sub_category")}
                className={inputCls}
                placeholder="e.g. Leakage"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Building">
              <select value={form.location_building} onChange={set("location_building")} className={inputCls}>
                <option value="">Select…</option>
                {BUILDINGS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>

            <Field label="Ward / Floor">
              <input
                value={form.location_ward}
                onChange={set("location_ward")}
                className={inputCls}
                placeholder="e.g. 3rd Floor"
              />
            </Field>
          </div>

          <Field label="Address">
            <input
              value={form.location_address}
              onChange={set("location_address")}
              className={inputCls}
              placeholder="e.g. Block A, Room 204"
            />
          </Field>

          <Field label={<>Description <span className="text-gray-400 text-xs">(min 10 chars)</span></>}>
            <textarea
              value={form.description}
              onChange={set("description")}
              className={`${inputCls} h-28 resize-none`}
              placeholder="Describe the issue in detail…"
              minLength={10}
            />
            <p className={`text-xs mt-1 ${form.description.length < 10 ? "text-red-400" : "text-green-500"}`}>
              {form.description.length} characters
            </p>
          </Field>

          {/* Media upload */}
          <MediaUploadZone
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            existingUrls={existingUrls}
            setExistingUrls={setExistingUrls}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-5 py-2 bg-violet-500 text-white rounded-lg text-sm font-semibold hover:bg-violet-600 disabled:opacity-50 transition min-w-[130px] flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </>
              ) : submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEdit ? "Updating…" : "Submitting…"}
                </>
              ) : (
                isEdit ? "Update Issue" : "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Delete confirmation

const DeleteModal = ({ issue, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteMyIssue(issue.id);
      onDeleted(issue.id);
      toast.success("Issue deleted.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-center font-bold text-gray-900 text-base mb-1">Delete Issue?</h3>
        <p className="text-center text-sm text-gray-500 mb-6 leading-relaxed">
          "{issue.title}" will be permanently removed. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Row card for the list

const IssueRow = ({ issue, onEdit, onDelete }) => {
  const s = STATUS_STYLE[issue.status] || STATUS_STYLE.new;
  const p = PRIORITY_STYLE[issue.priority] || PRIORITY_STYLE.low;
  const [expanded, setExpanded] = useState(false);

  const loc = [issue.location_building?.replace(/-/g, " "), issue.location_address, issue.location_ward]
    .filter(Boolean)
    .join(" • ");

  return (
    <div
      className={`relative group rounded-xl border bg-white transition-all duration-300 hover:shadow-md overflow-hidden`}
    >
      {/* Left status stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar} rounded-l-xl`} />

      <div className="pl-5 pr-4 py-4">
        {/* Top row: title + status + priority */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-snug">{issue.title}</h4>

            {/* Description */}
            <p className={`mt-1 text-sm text-gray-500 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
              {issue.description}
            </p>
            {issue.description?.length > 120 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs text-violet-500 mt-0.5 hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${s.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${p}`}>
              {issue.priority}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
          {loc && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="capitalize">{loc}</span>
            </span>
          )}
          {issue.main_category && (
            <span className="capitalize bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
              {issue.main_category}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(issue.created_at)}
          </span>
        </div>

        {/* Engagement stats */}
        {issue.engagement && (
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              {issue.engagement.net_votes ?? issue.engagement.upvotes ?? 0} votes
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {issue.engagement.comment_count ?? 0} comments
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          <button
            onClick={() => onEdit(issue)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-violet-50 hover:text-violet-600 border border-transparent hover:border-violet-200 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(issue)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats cards

const StatsBar = ({ issues }) => {
  const counts = issues.reduce(
    (acc, i) => {
      if (i.status === "resolved") acc.resolved++;
      else if (i.status === "in_progress") acc.inProgress++;
      else acc.pending++;
      return acc;
    },
    { resolved: 0, inProgress: 0, pending: 0 }
  );

  const cards = [
    { label: "Total Reported", value: issues.length, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Pending / New", value: counts.pending, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "In Progress", value: counts.inProgress, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", value: counts.resolved, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {cards.map(({ label, value, color, bg }) => (
        <div key={label} className={`${bg} rounded-xl p-4 border border-white shadow-sm`}>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
};

// Main Page

const FILTER_STATUS = ["all", "new", "acknowledged", "in_progress", "resolved", "closed"];

const MyIssues = () => {
  const { profileData } = useUser();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [formModal, setFormModal] = useState(null); // null | { mode: 'create'|'edit', issue? }
  const [deleteModal, setDeleteModal] = useState(null); // null | issue

  const load = async () => {
    if (!profileData?.id) return;
    setLoading(true);
    try {
      const data = await getMyIssues(profileData.id);
      setIssues(data);
    } catch (err) {
      toast.error(err.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData?.id) load();
  }, [profileData]);

  // Filter & search
  const filtered = issues.filter((i) => {
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      i.title?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.location_address?.toLowerCase().includes(q) ||
      i.main_category?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleSaved = (issue, mode) => {
    if (mode === "create") {
      setIssues((prev) => [issue, ...prev]);
    } else {
      setIssues((prev) => prev.map((i) => (i.id === issue.id ? issue : i)));
    }
  };

  const handleDeleted = (id) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <>
      <StudentSideNav />
      <BottomNav />
      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
        {/* Header */}
        <div className="w-full bg-violet-500 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                My Reported Issues
              </h1>
              <p className="text-violet-100 text-sm sm:text-base mt-1">
                Manage all issues you've submitted on campus.
              </p>
            </div>
            <button
              onClick={() => setFormModal({ mode: "create" })}
              className="w-full sm:w-auto bg-white text-violet-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition shadow text-sm"
            >
              + Report New Issue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
          {/* Main column */}
          <div className="lg:col-span-2">
            {/* Stats */}
            {!loading && <StatsBar issues={issues} />}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 mb-3 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search issues…"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-violet-400 transition"
                />
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 transition bg-white"
              >
                {FILTER_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All Status" : STATUS_STYLE[s]?.label || s}
                  </option>
                ))}
              </select>
            </div>

            {/* Issues list */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} height={140} borderRadius={12} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <div className="w-14 h-14 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">
                  {search || filterStatus !== "all" ? "No matching issues found" : "No issues reported yet"}
                </p>
                <p className="text-sm text-gray-400 mt-1 mb-4">
                  {search || filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Report your first campus issue"}
                </p>
                {!search && filterStatus === "all" && (
                  <button
                    onClick={() => setFormModal({ mode: "create" })}
                    className="bg-violet-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-violet-600 transition"
                  >
                    + Report Issue
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((issue) => (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    onEdit={(i) => setFormModal({ mode: "edit", issue: i })}
                    onDelete={(i) => setDeleteModal(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <UserCard limit={3} />

            {/* Quick tip card */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Quick Actions</h4>
              <button
                onClick={() => setFormModal({ mode: "create" })}
                className="w-full bg-violet-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-600 transition mb-2"
              >
                + Report New Issue
              </button>
              <button
                onClick={load}
                className="w-full bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition border border-gray-200"
              >
                ↻ Refresh
              </button>
            </div>

            {/* Status legend */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm">Status Guide</h4>
              <div className="space-y-2">
                {Object.entries(STATUS_STYLE).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${val.bar}`} />
                    <span className="text-xs text-gray-600">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {formModal && (
        <IssueFormModal
          initial={formModal.mode === "edit" ? formModal.issue : null}
          onClose={() => setFormModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          issue={deleteModal}
          onClose={() => setDeleteModal(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
};

export default MyIssues;