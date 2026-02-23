import { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import {
    createMyIssue,
    updateMyIssue,
    uploadMultipleMedia,
} from "../../Utils/issuesStudent";

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
    }, [newFiles, existingUrls, setNewFiles]);

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
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="ri-camera-fill text-violet-600" />
                    Attach Proof <span className="text-red-500 font-bold">*</span>
                </label>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{total} / 6 files</span>
            </div>

            {/* Drop zone */}
            {total < 6 && (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`border border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-all duration-200
                        ${dragging ? "border-violet-500 bg-violet-50/50 shadow-sm" : "border-gray-300 bg-gray-50/30 hover:bg-gray-50 hover:border-violet-400"}`}
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm border border-gray-100">
                        <i className="ri-upload-2-line text-lg text-violet-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                        Click to upload or <span className="text-violet-600">drag and drop</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Photos or videos of the issue</p>
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
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {existingUrls.map((url) => (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group bg-gray-100">
                            {isVideoUrl(url) ? (
                                <video src={url} className="w-full h-full object-cover" />
                            ) : (
                                <img src={url} alt="" className="w-full h-full object-cover" />
                            )}
                            <button
                                type="button"
                                onClick={() => removeExisting(url)}
                                className="absolute top-1 right-1 w-6 h-6 bg-white/90 backdrop-blur shadow-sm text-red-500 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                                <i className="ri-close-line" />
                            </button>
                        </div>
                    ))}
                    {newFiles.map((file, i) => (
                        <div key={file.preview} className="relative aspect-square rounded-lg overflow-hidden border-2 border-violet-100 group bg-gray-100">
                            {file.type.startsWith("video") ? (
                                <video src={file.preview} className="w-full h-full object-cover" />
                            ) : (
                                <img src={file.preview} alt="" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-1 left-1 bg-violet-600 text-white text-[8px] font-bold px-1 rounded shadow-sm">NEW</div>
                            <button
                                type="button"
                                onClick={() => removeNew(i)}
                                className="absolute top-1 right-1 w-6 h-6 bg-white/90 backdrop-blur shadow-sm text-red-500 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                                <i className="ri-close-line" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Field = ({ label, icon, children, error, required }) => (
    <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            {icon && <i className={`${icon} text-violet-500 text-base`} />}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-rose-500 font-medium ml-1">{error}</p>}
    </div>
);

const ReportIssueModal = ({ initial, onClose, onSaved }) => {
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

        // Validation
        if (newFiles.length + existingUrls.length === 0) {
            return toast.warning("Please upload at least one image/video as proof");
        }
        if (!form.title.trim()) return toast.warning("Please enter a title");
        if (!form.description.trim() || form.description.length < 10)
            return toast.warning("Description must be at least 10 characters");
        if (!form.location_building) return toast.warning("Please select a building");
        if (!form.main_category) return toast.warning("Please select a category");

        setSubmitting(true);
        try {
            let uploadedUrls = [];
            if (newFiles.length > 0) {
                setUploading(true);
                try {
                    uploadedUrls = await uploadMultipleMedia(newFiles);
                } catch (uploadErr) {
                    toast.error("Media upload failed. Please try again.");
                    setUploading(false);
                    setSubmitting(false);
                    return;
                }
                setUploading(false);
            }

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

    const inputCls =
        "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5 transition-all placeholder:text-gray-400";

    return (
        <div
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-0 sm:p-4 z-[9999]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-none sm:rounded-2xl shadow-xl w-full max-w-xl flex flex-col h-full sm:h-auto sm:max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                            <i className={`${isEdit ? "ri-edit-line" : "ri-feedback-line"} text-xl text-violet-600`} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">
                                {isEdit ? "Update Report" : "Report Issue"}
                            </h2>
                            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                                Provide details and proof for quick resolution
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <i className="ri-close-line text-xl" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Media first */}
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                        <MediaUploadZone
                            newFiles={newFiles}
                            setNewFiles={setNewFiles}
                            existingUrls={existingUrls}
                            setExistingUrls={setExistingUrls}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <Field label="Title" icon="ri-t-box-line" required>
                                <input
                                    value={form.title}
                                    onChange={set("title")}
                                    className={inputCls}
                                    placeholder="Short summary of the issue..."
                                />
                            </Field>
                        </div>

                        <Field label="Category" icon="ri-grid-line" required>
                            <div className="relative">
                                <select value={form.main_category} onChange={set("main_category")} className={`${inputCls} appearance-none pr-10 cursor-pointer`}>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c.charAt(0).toUpperCase() + c.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </Field>

                        <Field label="Sub-Category" icon="ri-price-tag-3-line">
                            <input
                                value={form.sub_category}
                                onChange={set("sub_category")}
                                className={inputCls}
                                placeholder="e.g. Broken Glass"
                            />
                        </Field>

                        <Field label="Building" icon="ri-building-line" required>
                            <div className="relative">
                                <select value={form.location_building} onChange={set("location_building")} className={`${inputCls} appearance-none pr-10 cursor-pointer`}>
                                    <option value="">Select Building</option>
                                    {BUILDINGS.map(([v, l]) => (
                                        <option key={v} value={v}>{l}</option>
                                    ))}
                                </select>
                                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </Field>

                        <Field label="Floor / Wing" icon="ri-map-pin-range-line">
                            <input
                                value={form.location_ward}
                                onChange={set("location_ward")}
                                className={inputCls}
                                placeholder="e.g. 2nd Floor"
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Specific Detail" icon="ri-map-pin-line">
                                <input
                                    value={form.location_address}
                                    onChange={set("location_address")}
                                    className={inputCls}
                                    placeholder="Room number or specific spot..."
                                />
                            </Field>
                        </div>

                        <div className="sm:col-span-2">
                            <Field
                                label="Description"
                                icon="ri-text-align-left"
                                required
                                error={form.description.length > 0 && form.description.length < 10 ? "At least 10 characters required" : null}
                            >
                                <textarea
                                    value={form.description}
                                    onChange={set("description")}
                                    className={`${inputCls} h-28 resize-none py-3`}
                                    placeholder="Explain the issue in detail..."
                                    minLength={10}
                                />
                                <div className="flex justify-end pr-1 pt-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${form.description.length < 10 ? "text-gray-400" : "text-emerald-600"}`}>
                                        {form.description.length} Characters
                                    </span>
                                </div>
                            </Field>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 min-w-[140px] justify-center shadow-lg shadow-violet-100"
                    >
                        {uploading || submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{uploading ? "Uploading..." : "posting..."}</span>
                            </>
                        ) : (
                            <>
                                <i className={isEdit ? "ri-save-line" : "ri-send-plane-fill"} />
                                <span>{isEdit ? "Update Report" : "Submit Report"}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportIssueModal;
