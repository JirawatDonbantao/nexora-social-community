// src/components/CommentItem.jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaEllipsisH } from "react-icons/fa";
import { reactions, formatRelativeTime, PROFILE_IMAGE, PROFILE_NAME } from "../utils/postUtils";
import ReactionIcon from "./ReactionIcon";
import CommentReactionControl from "./CommentReactionControl";

function CommentItem({
  comment,
  now,
  postId,
  onReact,
  onReply,
  onReplyReact,
  depth = 0,
}) {
  const [replyingToReplyId, setReplyingToReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const replyInputRef = useRef(null);

  const selectedReaction = reactions.find((r) => r.id === comment.reaction);
  const totalReactionCount = comment.reactionCount + (comment.reaction ? 1 : 0);

  useEffect(() => {
    if (replyingToReplyId === comment.id) {
      replyInputRef.current?.focus();
    }
  }, [comment.id, replyingToReplyId]);

  // ── Reply input handlers ──
  function handleReplyClick() {
    setReplyingToReplyId(comment.id);
    setReplyText("");
  }

  function handleReplyKeyDown(e) {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (replyText.trim()) {
        onReply(postId, comment.id, replyText.trim());
        setReplyText("");
        setReplyingToReplyId(null);
      }
    }
    if (e.key === "Escape") {
      setReplyingToReplyId(null);
      setReplyText("");
    }
  }

  return (
    <div className="comment-item">
      {/* ── Comment itself ── */}
      <div className="comment-row">
        <img src={PROFILE_IMAGE} alt="avatar" className="comment-avatar" />
        <div className="comment-body">
          {/* Bubble area with more options button */}
          <div className="comment-bubble-row">
            <div className="comment-bubble-wrapper">
              <div className="comment-bubble">
                <strong className="comment-name">{PROFILE_NAME}</strong>
                <p className="comment-text">{comment.text}</p>
              </div>
              
              {/* Reaction badge on the right edge of bubble */}
              {totalReactionCount > 0 && selectedReaction && (
                <div className="comment-reaction-badge">
                  <ReactionIcon reaction={selectedReaction} className="reaction-badge-gif" />
                  {totalReactionCount > 1 && <span>{totalReactionCount}</span>}
                </div>
              )}
            </div>

            {/* More options button */}
            <button type="button" className="comment-more-btn" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="ตัวเลือกความคิดเห็น — ฟีเจอร์เดโม">
              <FaEllipsisH />
            </button>
          </div>

          {/* Action row */}
          <div className="comment-actions">
            <span className="comment-time">{formatRelativeTime(comment.createdAt, now)}</span>

            <CommentReactionControl
              selectedReaction={selectedReaction}
              onSelectReaction={(reactionId) => onReact(postId, comment.id, reactionId)}
            />

            {depth === 0 && (
              <>
                <button
                  type="button"
                  className="comment-action-btn"
                  onClick={handleReplyClick}
                >
                  ตอบกลับ
                </button>
                <button type="button" className="comment-action-btn" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน">
                  แชร์
                </button>
              </>
            )}
          </div>

          {/* Reply input */}
          {replyingToReplyId === comment.id && (
            <div className="reply-input-row">
              <img src={PROFILE_IMAGE} alt="avatar" className="reply-avatar" />
              <div className="reply-input-wrap">
                <input
                  ref={replyInputRef}
                  type="text"
                  className="reply-input"
                  placeholder={`ตอบกลับ ${PROFILE_NAME}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleReplyKeyDown}
                />
                <span className="reply-input-hint">Enter เพื่อส่ง · Esc เพื่อยกเลิก</span>
              </div>
            </div>
          )}

          {/* Replies (nested, depth = 1 max) */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="comment-replies">
              {comment.replies.map((reply) => {
                const replyReaction = reactions.find((r) => r.id === reply.reaction);
                const replyTotalReactions = reply.reactionCount + (reply.reaction ? 1 : 0);

                return (
                  <div key={reply.id} className="comment-item reply-item">
                    <div className="comment-row">
                      <img src={PROFILE_IMAGE} alt="avatar" className="comment-avatar comment-avatar--sm" />
                      <div className="comment-body">
                        <div className="comment-bubble-row">
                          <div className="comment-bubble-wrapper">
                            <div className="comment-bubble comment-bubble--reply">
                              <strong className="comment-name">{PROFILE_NAME}</strong>
                              <p className="comment-text">{reply.text}</p>
                            </div>

                            {replyTotalReactions > 0 && replyReaction && (
                              <div className="comment-reaction-badge">
                                <ReactionIcon reaction={replyReaction} className="reaction-badge-gif" />
                                {replyTotalReactions > 1 && <span>{replyTotalReactions}</span>}
                              </div>
                            )}
                          </div>

                          <button type="button" className="comment-more-btn" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="ตัวเลือกคำตอบ — ฟีเจอร์เดโม">
                            <FaEllipsisH />
                          </button>
                        </div>

                        <div className="comment-actions">
                          <span className="comment-time">{formatRelativeTime(reply.createdAt, now)}</span>

                          <CommentReactionControl
                            selectedReaction={replyReaction}
                            onSelectReaction={(reactionId) => onReplyReact(postId, comment.id, reply.id, reactionId)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.number.isRequired,
    reaction: PropTypes.string,
    reactionCount: PropTypes.number,
    replies: PropTypes.array,
  }).isRequired,
  now: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
  onReact: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onReplyReact: PropTypes.func.isRequired,
  depth: PropTypes.number,
};

export default CommentItem;
