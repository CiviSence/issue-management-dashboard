import StudentSideNav from "./StudentSideNav";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  createIssue,
  downvoteIssue,
  getIssuesFeed,
  upvoteIssue,
  removeVote,
  fetchComments,
  addComment,
} from "../../../Utils/issues";
import Loader from "../../Templates/Loader";
import defaultAvatar from "../../../assets/default-avatar.jpg";

// Helpers

const formatTimeAgo = (dateString) => {
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
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const isVideo = (url) =>
  /\.(mp4|mov|webm)(\?.*)?$/i.test(url);

const STATUS_MAP = {
  new: { label: "New", bg: "bg-blue-50", text: "text-blue-600" },
  acknowledged: { label: "Acknowledged", bg: "bg-indigo-50", text: "text-indigo-600" },
  in_progress: { label: "In Progress", bg: "bg-yellow-50", text: "text-yellow-600" },
  resolved: { label: "Resolved", bg: "bg-green-50", text: "text-green-600" },
  closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-500" },
};

// IssueCard - individual card state

const IssueCard = ({ issue, onOpenComments }) => {
  const [voteState, setVoteState] = useState(issue.engagement.user_voted);
  const [netVotes, setNetVotes] = useState(issue.engagement.net_votes);
  const [upvotes, setUpvotes] = useState(issue.engagement.upvotes);
  const [downvotes, setDownvotes] = useState(issue.engagement.downvotes);
  const [expanded, setExpanded] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [commentCount, setCommentCount] = useState(issue.engagement.comment_count);

  const status = STATUS_MAP[issue.status] || STATUS_MAP.new;
  const descLimit = 160;
  const longDesc = issue.description && issue.description.length > descLimit;
  const displayDesc =
    longDesc && !expanded
      ? issue.description.slice(0, descLimit) + "…"
      : issue.description;

  const displayLocation = [
    issue.location_building,
    issue.location_address,
    issue.location_ward,
  ]
    .filter(Boolean)
    .join(", ");

  const handleVote = async (type) => {
    const prevVote = voteState;
    const prevNet = netVotes;
    const prevUp = upvotes;
    const prevDown = downvotes;

    let newVote = null;
    let newNet = netVotes;
    let newUp = upvotes;
    let newDown = downvotes;

    if (type === "up") {
      if (voteState === true) {
        newVote = null; newNet -= 1; newUp -= 1;
      } else {
        newVote = true;
        newNet += voteState === false ? 2 : 1;
        newUp += 1;
        if (voteState === false) newDown -= 1;
      }
    } else {
      if (voteState === false) {
        newVote = null; newNet += 1; newDown -= 1;
      } else {
        newVote = false;
        newNet -= voteState === true ? 2 : 1;
        newDown += 1;
        if (voteState === true) newUp -= 1;
      }
    }

    // Optimistic update
    setVoteState(newVote);
    setNetVotes(newNet);
    setUpvotes(newUp);
    setDownvotes(newDown);

    try {
      if (newVote === null) await removeVote(issue.id);
      else if (newVote === true) await upvoteIssue(issue.id);
      else await downvoteIssue(issue.id);
    } catch {
      // Revert
      setVoteState(prevVote);
      setNetVotes(prevNet);
      setUpvotes(prevUp);
      setDownvotes(prevDown);
      toast.error("Failed to register vote. Please try again.");
    }
  };

  const handleCommentOpen = () => {
    onOpenComments(issue.id, commentCount, (delta) =>
      setCommentCount((c) => c + delta)
    );
  };

  const medias = issue.media_urls?.filter((u) => u && u !== "string") || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Profile info */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={issue.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(issue.user?.name || "User")}&background=ede9fe&color=7c3aed&bold=true`}
            alt={issue.user?.name}
            onError={(e) => { e.target.src = defaultAvatar; }}
            className="w-10 h-10 rounded-full object-cover border-2 border-violet-100 shrink-0"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {issue.user?.name || "Unknown User"}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
              <span>{formatTimeAgo(issue.created_at)}</span>
              {displayLocation && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[180px]">{displayLocation}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      {/* titl n descrip */}
      <div className="px-5 pb-3">
        {(issue.priority === "high" || issue.priority === "critical") && (
          <span className="inline-block mb-1.5 px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded-md uppercase tracking-wide">
            {issue.priority} priority
          </span>
        )}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
          {issue.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {displayDesc}
          {longDesc && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 text-violet-600 font-medium hover:underline focus:outline-none"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      </div>

      {/* Images/Videos */}
      {medias.length > 0 && (
        <div className="relative bg-gray-100 overflow-hidden" style={{ maxHeight: 340 }}>
          {isVideo(medias[mediaIndex]) ? (
            <video
              src={medias[mediaIndex]}
              controls
              className="w-full h-full object-cover"
              style={{ maxHeight: 340 }}
            />
          ) : (
            <img
              src={medias[mediaIndex]}
              alt=""
              className="w-full object-cover"
              style={{ maxHeight: 340 }}
            />
          )}
          {/* Carousel arrows */}
          {medias.length > 1 && (
            <>
              <button
                onClick={() => setMediaIndex((i) => (i - 1 + medias.length) % medias.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ‹
              </button>
              <button
                onClick={() => setMediaIndex((i) => (i + 1) % medias.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ›
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {medias.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMediaIndex(i)}
                    className={`w-2 h-2 rounded-full transition ${i === mediaIndex ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
              {/* Counter badge */}
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                {mediaIndex + 1} / {medias.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Feed Actions (Upvote, Downvote, Comment) */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
        {/* Vote group */}
        <div className="flex items-center gap-5">
          <div className="flex items-center bg-gray-50 rounded-xl px-1 py-0.5 gap-1">
            {/* Upvote */}
            <button
              onClick={() => handleVote("up")}
              title="Upvote"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${voteState === true
                ? "text-violet-600 bg-violet-50"
                : "text-gray-500 hover:text-violet-600 hover:bg-white"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{upvotes}</span>
            </button>

            <div className="w-px h-4 bg-gray-200 mx-0.5" />

            {/* Net score */}
            <span
              className={`px-1 text-sm font-bold tabular-nums ${netVotes > 0
                ? "text-violet-600"
                : netVotes < 0
                  ? "text-red-500"
                  : "text-gray-400"
                }`}
            >
              {netVotes > 0 ? "+" : ""}{netVotes}
            </span>

            <div className="w-px h-4 bg-gray-200 mx-0.5" />

            {/* Downvote */}
            <button
              onClick={() => handleVote("down")}
              title="Downvote"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${voteState === false
                ? "text-red-500 bg-red-50"
                : "text-gray-500 hover:text-red-500 hover:bg-white"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
              <span>{downvotes}</span>
            </button>
          </div>

          {/* Comments */}
          <button
            onClick={handleCommentOpen}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 px-2.5 py-1.5 rounded-lg transition-all group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">{commentCount}</span>
          </button>
        </div>

        {/* Category chip */}
        {issue.main_category && (
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg capitalize">
            {issue.main_category}
          </span>
        )}
      </div>

      {/* Comments preview */}
      {issue.recent_comments?.length > 0 && (
        <div
          className="px-5 pb-4 pt-0 border-t border-gray-50 space-y-1.5 cursor-pointer"
          onClick={handleCommentOpen}
        >
          {issue.recent_comments.slice(0, 2).map((c, i) => (
            <div key={i} className="flex gap-1.5 text-xs text-gray-500">
              <span className="font-semibold text-gray-700 shrink-0">
                {c.user?.name || "User"}:
              </span>
              <span className="truncate">{c.text}</span>
            </div>
          ))}
          {commentCount > 2 && (
            <span className="text-xs text-violet-500 font-medium hover:underline">
              View all {commentCount} comments →
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Comments Modal

const CommentsModal = ({ issueId, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchComments(issueId)
      .then((data) => { if (!cancelled) { setComments(data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [issueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await addComment(issueId, text.trim());
      setComments((prev) => [...prev, newComment]);
      setText("");
      onCommentAdded(1);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">Comments</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-gray-400 py-8 text-sm">No comments yet. Be first!</p>
          ) : (
            comments.map((c, i) => (
              <div key={c.id ?? i} className="flex gap-3">
                <img
                  src={c.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || "U")}&background=ede9fe&color=7c3aed`}
                  alt={c.user?.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-gray-800">{c.user?.name || "User"}</span>
                    {c.created_at && (
                      <span className="text-xs text-gray-400">{formatTimeAgo(c.created_at)}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-5 py-3 border-t border-gray-100 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
          />
          <button
            type="submit"
            disabled={submitting || !text.trim()}
            className="bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-violet-600 disabled:opacity-50 transition shrink-0"
          >
            {submitting ? "…" : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Report Issue Modal

const ReportModal = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [main_category, setMainCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [location_address, setLocationAddress] = useState("");
  const [location_building, setLocationBuilding] = useState("");
  const [location_ward, setLocationWard] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.warning("Please enter an issue title");
    if (!description.trim() || description.length < 10)
      return toast.warning("Description must be at least 10 characters");
    if (!location_building) return toast.warning("Please select a building");
    if (!main_category) return toast.warning("Please select a category");

    try {
      setIsSubmitting(true);
      await createIssue({
        title: title.trim(),
        description: description.trim(),
        main_category,
        sub_category: sub_category || "general",
        location_address,
        location_building,
        location_ward: location_ward || "",
        media_urls: [],
      });
      toast.success("Issue reported successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Report New Issue</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Issue Title", value: title, setter: setTitle, placeholder: "e.g. Broken projector in Room 301", type: "input" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-violet-500 outline-none text-sm"
                placeholder={placeholder}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
            <select value={main_category} onChange={(e) => setMainCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-violet-500 outline-none text-sm">
              <option value="">Select Category</option>
              {["security", "cleanliness", "maintenance", "infrastructure", "facilities", "other"].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
            <input value={sub_category} onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-violet-500 outline-none text-sm"
              placeholder="e.g. Leakage, Fan not working" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Building</label>
            <select value={location_building} onChange={(e) => setLocationBuilding(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-violet-500 outline-none text-sm">
              <option value="">Select Building</option>
              {[["boys-hostel", "Boys Hostel"], ["girls-hostel", "Girls Hostel"], ["admin-building", "Admin Building"], ["faculty-building", "Faculty Building"], ["campus", "Campus"], ["other", "Other"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={location_address} onChange={(e) => setLocationAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-violet-500 outline-none text-sm"
              placeholder="e.g. Block A" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward / Floor</label>
            <input value={location_ward} onChange={(e) => setLocationWard(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-violet-500 outline-none text-sm"
              placeholder="e.g. 3rd Floor" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400 text-xs">(min 10 chars)</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 h-28 resize-none focus:border-violet-500 outline-none text-sm"
              placeholder="Describe the issue in detail..." minLength={10} />
            <p className={`text-xs mt-1 ${description.length < 10 ? "text-red-400" : "text-green-500"}`}>
              {description.length} characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="px-5 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 font-semibold disabled:opacity-50 text-sm transition">
              {isSubmitting ? "Submitting…" : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Filters

const SORTS = [
  { value: "recent", label: "Recent" },
  { value: "votes", label: "Top Voted" },
];

// Main Feed Component

const IssueFeed = () => {
  const [issues, setIssues] = useState(() => {
    try {
      const cached = localStorage.getItem("csm_cached_feed");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("recent");
  const [solvedOnly, setSolvedOnly] = useState(undefined); // undefined = all
  const limit = 10;

  // Comments modal state
  const [commentsModal, setCommentsModal] = useState(null); // { issueId, onIncrement }

  // Report modal
  const [showReport, setShowReport] = useState(false);

  const isFirstMount = useRef(true);

  const fetchIssues = useCallback(
    async (reset = false) => {
      if (isLoading) return;
      const currentSkip = reset ? 0 : skip;
      setIsLoading(true);
      try {
        const params = { skip: currentSkip, limit, sort };
        if (solvedOnly === true) params.solved_only = true;
        if (solvedOnly === false) params.solved_only = false;

        const newIssues = await getIssuesFeed(params);
        setIssues((prev) => {
          const base = reset ? [] : prev;
          const existingIds = new Set(base.map((i) => i.id));
          const updated = [...base, ...newIssues.filter((i) => !existingIds.has(i.id))];

          if (reset && newIssues.length > 0) {
            try {
              localStorage.setItem("csm_cached_feed", JSON.stringify(newIssues.slice(0, 20)));
            } catch (e) {
              console.warn("Failed to cache feed", e);
            }
          }
          return updated;
        });
        setSkip(currentSkip + limit);
        if (newIssues.length < limit) setHasMore(false);
        else setHasMore(true);
      } catch (err) {
        console.error(err);
        if (issues.length === 0) toast.error("Failed to load feed");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, skip, sort, solvedOnly, issues.length]
  );

  // Initial load + refetch on filter change
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // Background fetch on mount
      fetchIssues(true);
      return;
    }
    setIssues([]);
    setSkip(0);
    setHasMore(true);
    // fetchIssues will be called via the issues.length listener below
  }, [sort, solvedOnly]);

  // Trigger fetch when issues array is reset (empty after filter change)
  const prevLength = useRef(issues.length);
  useEffect(() => {
    if (issues.length === 0 && prevLength.current !== 0) {
      fetchIssues(true);
    } else if (issues.length === 0 && prevLength.current === 0 && !isLoading && !isFirstMount.current) {
      fetchIssues(true);
    }
    prevLength.current = issues.length;
  }, [issues.length, isLoading, fetchIssues]);

  const handleOpenComments = (issueId, count, onIncrement) => {
    setCommentsModal({ issueId, count, onIncrement });
  };

  const handleReportSuccess = () => {
    // Refresh feed
    setIssues([]);
    setSkip(0);
    setHasMore(true);
  };

  return (
    <>
      <StudentSideNav />
      <BottomNav />
      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
        {/* Header banner */}
        <div className="w-full bg-violet-500 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                Issue Feed
              </h1>
              <p className="text-violet-100 text-sm sm:text-base mt-1">
                Explore campus issues reported by your community.
              </p>
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="w-full sm:w-auto bg-white text-violet-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition shadow text-sm sm:text-base"
            >
              + Report Issue
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap items-center gap-3">
              {/* Sort tabs */}
              <div className="flex gap-1 bg-gray-50 rounded-lg p-0.5">
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSort(s.value)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${sort === s.value
                      ? "bg-white text-violet-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex gap-1 ml-auto">
                {[
                  { label: "All", val: undefined },
                  { label: "Active", val: false },
                  { label: "Resolved", val: true },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    onClick={() => setSolvedOnly(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${solvedOnly === val
                      ? "bg-violet-500 text-white border-violet-500"
                      : "bg-white text-gray-500 border-gray-200 hover:border-violet-300"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed */}
            <div
              id="feedScroll"
              className="h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1"
            >
              <InfiniteScroll
                dataLength={issues.length}
                next={() => fetchIssues(false)}
                hasMore={hasMore}
                loader={<Loader />}
                scrollableTarget="feedScroll"
                endMessage={
                  <p className="text-center text-gray-400 text-sm py-6">
                    {issues.length === 0 ? "No issues found." : "You've seen it all! 🎉"}
                  </p>
                }
              >
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onOpenComments={handleOpenComments}
                  />
                ))}
              </InfiniteScroll>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <UserCard limit={3} />
            {/* <div className="bg-violet-500 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden mt-4">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Campus News</h3>
                <p className="text-violet-200 text-sm">Stay updated with the latest announcements.</p>
                <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-xs">📢 Exam schedule released!</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400 rounded-full blur-3xl opacity-40 -mr-10 -mt-10" />
            </div> */}

            {/* Quick report shortcut (sidebar) */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-semibold text-gray-800 mb-1">Have a problem?</h4>
              <p className="text-sm text-gray-500 mb-3">Report a new issue on campus.</p>
              <button
                onClick={() => setShowReport(true)}
                className="w-full bg-violet-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-violet-600 transition"
              >
                + Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      {commentsModal && (
        <CommentsModal
          issueId={commentsModal.issueId}
          onClose={() => setCommentsModal(null)}
          onCommentAdded={(delta) => {
            commentsModal.onIncrement(delta);
          }}
        />
      )}

      {/* Report Modal */}
      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          onSuccess={handleReportSuccess}
        />
      )}
    </>
  );
};

export default IssueFeed;
