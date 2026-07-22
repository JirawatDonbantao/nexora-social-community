// src/components/PostModal.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaGlobeAsia,
  FaComment,
  FaShare,
  FaEllipsisH,
} from "react-icons/fa";
import {
  reactions,
  formatRelativeTime,
  PROFILE_IMAGE,
  PROFILE_NAME,
} from "../utils/postUtils";
import ReactionBar from "./ReactionBar";
import StatsBar from "./StatsBar";
import ShareMenu from "./ShareMenu";
import CommentItem from "./CommentItem";
import { useDialogA11y } from "../hooks/useDialogA11y";

// ── Sort options ──
const SORT_OPTIONS = [
  {
    id: "relevant",
    label: "เกี่ยวข้องมากที่สุด",
    desc: "แสดงความคิดเห็นของเพื่อนและความคิดเห็นที่มีการมีส่วนร่วมมากที่สุดก่อน",
  },
  {
    id: "newest",
    label: "ใหม่ล่าสุด",
    desc: "แสดงความคิดเห็นทั้งหมดโดยแสดงความคิดเห็นล่าสุดก่อน",
  },
  {
    id: "all",
    label: "ความคิดเห็นทั้งหมด",
    desc: "แสดงความคิดเห็นทั้งหมด รวมถึงรายการที่อาจเป็นสแปมด้วย",
  },
];

function sortComments(comments, mode) {
  const arr = [...comments];
  if (mode === "relevant") {
    return arr.sort((a, b) => {
      const scoreA = (a.reactionCount || 0) + (a.reaction ? 1 : 0) + (a.replies?.length || 0);
      const scoreB = (b.reactionCount || 0) + (b.reaction ? 1 : 0) + (b.replies?.length || 0);
      return scoreB - scoreA;
    });
  }
  if (mode === "newest") {
    return arr.sort((a, b) => b.createdAt - a.createdAt);
  }
  if (mode === "oldest" || mode === "all") {
    return arr.sort((a, b) => a.createdAt - b.createdAt);
  }
  return arr;
}

function PostModal({
  post,
  now,
  closeModal,
  setReaction,
  addComment,
  addReply,
  setCommentReaction,
  setReplyReaction,
  sharePost,
  onCopyLink,
}) {
  const [commentText, setCommentText] = useState("");
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [sortMode, setSortMode] = useState("relevant");
  const [showSortPopup, setShowSortPopup] = useState(false);
  const sortPopupRef = useRef(null);
  const sortBtnRef = useRef(null);
  const [sortPopupPos, setSortPopupPos] = useState({ top: 0, left: 0 });
  const commentInputRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useDialogA11y({ dialogRef, initialFocusRef: closeButtonRef, onClose: closeModal });

  const sortedComments = useMemo(
    () => sortComments(post?.comments ?? [], sortMode),
    [post?.comments, sortMode]
  );

  useEffect(() => {
    function handleOutsideClick(event) {
      const clickedPopup = sortPopupRef.current && sortPopupRef.current.contains(event.target);
      const clickedButton = sortBtnRef.current && sortBtnRef.current.contains(event.target);
      if (!clickedPopup && !clickedButton) {
        setShowSortPopup(false);
      }
    }

    if (showSortPopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showSortPopup]);

  if (!post) return null;

  const selectedReaction = reactions.find((r) => r.id === post.reaction);
  const totalReactions = post.baseReactionCount + (post.reaction ? 1 : 0);
  const commentCount = post.comments?.length || 0;
  const currentSort = SORT_OPTIONS.find((o) => o.id === sortMode);

  function onCommentKeyDown(event) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (commentText.trim()) {
        addComment(post.id, commentText);
        setCommentText("");
      }
    }
  }

  function onShareNow() {
    sharePost(post.id);
    setIsShareMenuOpen(false);
  }

  function handleCopyLink() {
    onCopyLink();
    setIsShareMenuOpen(false);
  }

  function handleSortSelect(optionId) {
    setSortMode(optionId);
    setShowSortPopup(false);
  }

  function focusCommentInput() {
    commentInputRef.current?.focus();
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        ref={dialogRef}
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="modal-title-bar">
          <h2 id="post-modal-title">โพสต์ของ {PROFILE_NAME}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="modal-body">
          {/* Post header */}
          <div className="modal-post-header">
            <img src={PROFILE_IMAGE} alt="profile" className="modal-avatar" />
            <div className="modal-post-meta">
              <h4>{PROFILE_NAME}</h4>
              <div className="modal-post-time">
                <span>{formatRelativeTime(post.createdAt, now)}</span>
                <span>·</span>
                <FaGlobeAsia />
              </div>
            </div>
            <button
              type="button"
              className="modal-more-btn"
              disabled
              title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"
              aria-label="ตัวเลือกโพสต์ — ฟีเจอร์เดโม"
            >
              <FaEllipsisH />
            </button>
          </div>

          {/* Post text */}
          {post.title && <p className="modal-post-text">{post.title}</p>}

          {/* Post image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="modal-post-image"
            />
          )}

          {/* Stats bar */}
          <StatsBar
            totalReactions={totalReactions}
            commentCount={commentCount}
            shareCount={post.shareCount}
            selectedReaction={selectedReaction}
            className="modal-stats"
          />

          {/* Action buttons */}
          <div className="modal-actions-bar">
            <ReactionBar
              postId={post.id}
              selectedReaction={selectedReaction}
              onSetReaction={setReaction}
            />

            <button
              type="button"
              className="action-btn"
              onClick={focusCommentInput}
            >
              <FaComment /> แสดงความคิดเห็น
            </button>

            <button
              type="button"
              className="action-btn"
              onClick={() => setIsShareMenuOpen((open) => !open)}
            >
              <FaShare /> แชร์
            </button>
          </div>

          {/* ── Sort dropdown ── */}
          <div className="modal-sort">
            <button
              ref={sortBtnRef}
              type="button"
              className="modal-sort-btn"
              onClick={() => {
                if (!showSortPopup && sortBtnRef.current) {
                  const rect = sortBtnRef.current.getBoundingClientRect();
                  setSortPopupPos({ top: rect.bottom + 4, left: rect.left });
                }
                setShowSortPopup((v) => !v);
              }}
            >
              {currentSort?.label} ▼
            </button>

            {showSortPopup && (
              <div
                ref={sortPopupRef}
                className="sort-popup"
                style={{ position: "fixed", top: sortPopupPos.top, left: sortPopupPos.left }}
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`sort-popup-item ${sortMode === option.id ? "active" : ""}`}
                    onClick={() => handleSortSelect(option.id)}
                  >
                    <div className="sort-item-text">
                      <span className="sort-item-label">{option.label}</span>
                      <span className="sort-item-desc">{option.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Comments list ── */}
          <div className="modal-comments">
            {commentCount === 0 ? (
              <p className="modal-no-comments">
                ยังไม่มีความคิดเห็น เริ่มแสดงความคิดเห็นเป็นคนแรก
              </p>
            ) : (
              sortedComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  now={now}
                  postId={post.id}
                  onReact={setCommentReaction}
                  onReply={addReply}
                  onReplyReact={setReplyReaction}
                />
              ))
            )}
          </div>
        </div>

        {/* Sticky comment input */}
        <div className="modal-comment-input">
          <img src={PROFILE_IMAGE} alt="profile" className="modal-comment-avatar" />
          <input
            ref={commentInputRef}
            type="text"
            placeholder="แสดงความคิดเห็น..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={onCommentKeyDown}
          />
        </div>

        {/* Share modal */}
        <ShareMenu
          isOpen={isShareMenuOpen}
          onClose={() => setIsShareMenuOpen(false)}
          onShareNow={onShareNow}
          onCopyLink={handleCopyLink}
        />
      </div>
    </div>
  );
}

PostModal.propTypes = {
  post: PropTypes.object,
  now: PropTypes.number.isRequired,
  closeModal: PropTypes.func.isRequired,
  setReaction: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  addReply: PropTypes.func.isRequired,
  setCommentReaction: PropTypes.func.isRequired,
  setReplyReaction: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired,
};

export default PostModal;
