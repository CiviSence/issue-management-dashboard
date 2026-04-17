import StudentSideNav from "./StudentSideNav";
import StudentBottomNav from "./StudentBottomNav";
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
import AdCard from "../../Templates/AdCard";
import defaultAvatar from "../../../assets/default-avatar.jpg";
import ReportIssueModal from "../../Templates/ReportIssueModal";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../../Templates/StatusBadge";
import { useUser } from "../../../Context/ProfileContext";

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

// IssueCard - individual card state

const IssueCard = ({ issue, onOpenComments }) => {
  const [voteState, setVoteState] = useState(issue.engagement.user_voted);
  const [netVotes, setNetVotes] = useState(issue.engagement.net_votes);
  const [upvotes, setUpvotes] = useState(issue.engagement.upvotes);
  const [downvotes, setDownvotes] = useState(issue.engagement.downvotes);
  const [expanded, setExpanded] = useState(false);
  const [[mediaIndex, direction], setMediaStep] = useState([0, 0]);
  const [commentCount, setCommentCount] = useState(issue.engagement.comment_count);
  const [isVoting, setIsVoting] = useState(false);

  const paginate = (newDirection) => {
    const nextIndex = (mediaIndex + newDirection + medias.length) % medias.length;
    setMediaStep([nextIndex, newDirection]);
  };

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

    if (isVoting) return;
    setIsVoting(true);

    // Optimistic update
    setVoteState(newVote);
    setNetVotes(newNet);
    setUpvotes(newUp);
    setDownvotes(newDown);

    try {
      if (newVote === null) {
        await removeVote(issue.id);
      } else {
        if (prevVote !== null) {
          await removeVote(issue.id);
        }
        if (newVote === true) await upvoteIssue(issue.id);
        else await downvoteIssue(issue.id);
      }
    } catch {
      // Revert
      setVoteState(prevVote);
      setNetVotes(prevNet);
      setUpvotes(prevUp);
      setDownvotes(prevDown);
      toast.error("Failed to register vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCommentOpen = () => {
    onOpenComments(issue.id, commentCount, (delta) =>
      setCommentCount((c) => c + delta)
    );
  };

  const medias = issue.media_urls?.filter((u) => u && u !== "string") || [];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Profile info */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {issue.user?.avatar_url ? (
            <img
              src={issue.user.avatar_url}
              alt={issue.user?.name}
              onError={(e) => { e.target.src = defaultAvatar; }}
              className="w-10 h-10 rounded-full object-cover border-2 border-violet-100 shrink-0"
            />
          ) : (
            <span className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold border-2 border-violet-100 shrink-0">
              {(issue.user?.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          )}
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
        <StatusBadge type="status" value={issue.status} className="shrink-0" />
      </div>

      {/* titl n descrip */}
      <div className="px-5 pb-3">
        {(issue.priority === "high" || issue.priority === "critical") && (
          <div className="mb-1.5 inline-block">
             <StatusBadge type="priority" value={issue.priority} />
          </div>
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
        <div className="relative overflow-hidden bg-black/5">
          <div className="w-full aspect-[4/3] relative flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={mediaIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-0"
              >
                {/* Blurred background image - only for current if needed, but absolute positioning makes it tricky */}
                {!isVideo(medias[mediaIndex]) && (
                  <img
                    src={medias[mediaIndex]}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-20 pointer-events-none"
                  />
                )}

                {/* Main image/video */}
                {isVideo(medias[mediaIndex]) ? (
                  <video
                    src={medias[mediaIndex]}
                    controls
                    className="w-full h-full object-contain pointer-events-auto"
                  />
                ) : (
                  <img
                    src={medias[mediaIndex]}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Dark overlay for readability (static) */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none z-10" />
          </div>

          {/* Carousel arrows */}
          {medias.length > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              >
                <i className="ri-arrow-left-s-line text-xl" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              >
                <i className="ri-arrow-right-s-line text-xl" />
              </button>

              {/* Counter badge */}
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-20 tracking-wider">
                {mediaIndex + 1} / {medias.length}
              </div>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {medias.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const dir = i > mediaIndex ? 1 : -1;
                      setMediaStep([i, dir]);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === mediaIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )
      }

      {/* Feed Actions (Upvote, Downvote, Comment) */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50">
        {/* Vote group */}
        <div className="flex items-center gap-5">
          <div className="flex items-center bg-gray-50 rounded-xl px-1 py-0.5 gap-1">
            {/* Upvote */}
            <button
              onClick={() => handleVote("up")}
              title="Upvote"
              disabled={isVoting}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${isVoting ? "opacity-50 cursor-not-allowed" : ""} ${voteState === true
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
              disabled={isVoting}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${isVoting ? "opacity-50 cursor-not-allowed" : ""} ${voteState === false
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

          {/* Views */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 px-2.5 py-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-medium">{issue.engagement.views_count || 0}</span>
          </div>
        </div>

        {/* Category chip */}
        {issue.main_category && (
          <div className="shrink-0">
             <StatusBadge type="category" value={issue.main_category} />
          </div>
        )}
      </div>

      {/* Comments preview */}
      {
        issue.recent_comments?.length > 0 && (
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
        )
      }
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
                {c.user?.avatar_url ? (
                  <img
                    src={c.user.avatar_url}
                    alt={c.user?.name}
                    onError={(e) => { e.target.src = defaultAvatar; }}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {(c.user?.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                )}
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

// Filters

const SORTS = [
  { value: "recent", label: "Recent" },
  { value: "votes", label: "Top Voted" },
];

// Main Feed Component

const IssueFeed = () => {
  const { profileData } = useUser();
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

  // Modal states
  const [formModal, setFormModal] = useState(null); // null | { mode: 'create'|'edit', issue? }
  const [commentsModal, setCommentsModal] = useState(null); // { issueId, count, onIncrement }
  const [showGreeting, setShowGreeting] = useState(true);

  const isFirstMount = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const fetchIssues = useCallback(
    async (reset = false) => {
      // Don't skip if it's a reset (force refresh)
      if (isLoading && !reset) return;

      const currentSkip = reset ? 0 : skip;
      if (reset) {
        setIsLoading(true); // Immediate feedback for reset
      } else {
        setIsLoading(true);
      }

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

  // Initial load + filter change
  useEffect(() => {
    setHasMore(true);
    setSkip(0);
    // Directly call with reset=true to bypass loading check if needed
    fetchIssues(true);
  }, [sort, solvedOnly]);

  const handleOpenComments = (issueId, count, onIncrement) => {
    setCommentsModal({ issueId, count, onIncrement });
  };

  const handleSaved = (issue, mode) => {
    // For simplicity in feed, we reset and refetch
    setIssues([]);
    setSkip(0);
    setHasMore(true);
    // fetchIssues(true) will be triggered by issues.length listener
  };

  return (
    <>
      <StudentSideNav />
      <StudentBottomNav />
      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen" id="mainScroll">
        {/* Mobile Greeting - Only on small screens */}
        <AnimatePresence>
          {showGreeting && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              className="sm:hidden w-full overflow-hidden"
            >
              <div className="bg-violet-600 rounded-2xl p-4 text-white shadow-lg flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Hello, {profileData?.name?.split(" ")[0] || "Buddy"}! 👋</h3>
                  <p className="text-violet-100 text-xs mt-0.5">Welcome back to your campus feed.</p>
                </div>
                <button
                  onClick={() => setShowGreeting(false)}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header banner - Hidden on mobile, shown from SM up */}
        <div className="hidden sm:block w-full bg-violet-500 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
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
              onClick={() => setFormModal({ mode: "create" })}
              className="w-full sm:w-auto bg-white text-violet-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-50 transition shadow text-sm sm:text-base border border-transparent hover:border-violet-100"
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
              className="lg:h-[calc(100vh-240px)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1"
            >
              <InfiniteScroll
                dataLength={issues.length}
                next={() => fetchIssues(false)}
                hasMore={hasMore}
                loader={<Loader />}
                scrollableTarget={window.innerWidth >= 1024 ? "feedScroll" : "mainScroll"}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                refreshFunction={() => fetchIssues(true)}
                pullDownToRefreshContent={
                  <div className="flex flex-col items-center py-4 bg-white/50 backdrop-blur-sm rounded-xl mb-3 border border-violet-100 shadow-sm transition-all animate-pulse">
                    <div className="p-2 bg-violet-100 rounded-full mb-1">
                      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <span className="text-violet-600 font-bold text-sm">Pull down to refresh</span>
                  </div>
                }
                releaseToRefreshContent={
                  <div className="flex flex-col items-center py-4 bg-violet-500 rounded-xl mb-3 shadow-lg shadow-violet-200 border border-violet-400 transition-all scale-105">
                    <div className="p-2 bg-white/20 rounded-full mb-1">
                      <svg className="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <span className="text-white font-bold text-sm">Release to refresh</span>
                  </div>
                }
                endMessage={
                  <p className="text-center text-gray-400 text-sm py-6">
                    {issues.length === 0 ? "No issues found." : "You've seen it all! 🎉"}
                  </p>
                }
              >
                {issues.map((item) => (
                  item.is_ad ? (
                    <AdCard key={item.id || `ad-${Math.random()}`} ad={item} />
                  ) : (
                    <IssueCard
                      key={item.id}
                      issue={item}
                      onOpenComments={handleOpenComments}
                    />
                  )
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
                onClick={() => setFormModal({ mode: "create" })}
                className="w-full bg-violet-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-violet-600 transition shadow-lg shadow-violet-100"
              >
                + Report Issue
              </button>
            </div>

            {/* Help & Support Shortcut */}
            <div className="mt-4 bg-linear-to-br from-violet-600 to-purple-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => window.location.href = "/help-support"}>
              <div className="relative z-10">
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  <i className="ri-customer-service-2-line" />
                  Need Help?
                </h4>
                <p className="text-violet-100 text-[11px] mb-3 leading-relaxed">Check our guides or contact support for assistance.</p>
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all border border-white/20">
                  Open Support
                </button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl" />
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

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setFormModal({ mode: "create" })}
        className="fixed bottom-28 right-4 w-14 h-14 bg-violet-600 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden z-40 active:scale-95 transition-transform border-4 border-white"
      >
        <i className="ri-add-line text-2xl" />
      </button>

      {/* Report Modal */}
      {formModal && (
        <ReportIssueModal
          initial={formModal.mode === "edit" ? formModal.issue : null}
          onClose={() => setFormModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default IssueFeed;
