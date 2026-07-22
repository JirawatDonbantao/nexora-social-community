import { useState } from "react";
import {
  FaEllipsisH,
  FaTimes,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { reactions, formatRelativeTime, PROFILE_IMAGE, PROFILE_NAME } from "../utils/postUtils";
import StatsBar from "./StatsBar";
import ShareMenu from "./ShareMenu";

function Post({
  post,
  now,
  removePost,
  setReaction,
  sharePost,
  onCopyLink,
  onOpenModal,
}) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const selectedReaction = reactions.find(
    (reaction) => reaction.id === post.reaction
  );

  const totalReactions = post.baseReactionCount + (post.reaction ? 1 : 0);
  const commentCount = post.comments?.length || 0;

  function onShareNow() {
    sharePost(post.id);
    setIsShareMenuOpen(false);
  }

  function handleCopyLink() {
    onCopyLink();
    setIsShareMenuOpen(false);
  }

  return (
    <div className="Post">
      {/* Header: avatar + name + time + menu + close */}
      <div className="Post__user">
        <img src={PROFILE_IMAGE} alt="profile" className="Post__avatar" />

        <div className="Post__meta">
          <h3>{post.isShared ? "คุณได้แชร์โพสต์" : PROFILE_NAME}</h3>
          <p>
            {formatRelativeTime(post.createdAt, now)}
            {post.isShared ? " · สาธารณะ" : ""}
          </p>
        </div>

        <button
          type="button"
          className="Post__menu-btn"
          disabled
          title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"
          aria-label="ตัวเลือกโพสต์ — ฟีเจอร์เดโม"
        >
          <FaEllipsisH />
        </button>

        <button
          type="button"
          className="Post__delete"
          onClick={() => removePost(post.id)}
          aria-label="Delete post"
        >
          <FaTimes />
        </button>
      </div>

      {/* Content: text + image */}
      <div className="Post__content">
        {post.title && !post.isShared && <p>{post.title}</p>}

        {post.image && !post.sharedFrom && (
          <img src={post.image} alt={post.title} className="Post__image" />
        )}

        {post.sharedFrom && (
          <div className="shared-post">
            <div className="shared-post__header">
              <img src={PROFILE_IMAGE} alt="original author" />
              <div>
                <strong>{post.sharedFrom.author}</strong>
                <span>{formatRelativeTime(post.sharedFrom.createdAt, now)}</span>
              </div>
            </div>

            {post.sharedFrom.title && <p>{post.sharedFrom.title}</p>}
            {post.sharedFrom.image && (
              <img
                src={post.sharedFrom.image}
                alt={post.sharedFrom.title}
                className="shared-post__image"
              />
            )}
          </div>
        )}
      </div>

      {/* Stats + actions bar (merged) */}
      <StatsBar
        totalReactions={totalReactions}
        commentCount={commentCount}
        shareCount={post.shareCount}
        selectedReaction={selectedReaction}
        postId={post.id}
        onSetReaction={setReaction}
        onOpenModal={() => onOpenModal(post.id)}
        onShareClick={() => setIsShareMenuOpen((open) => !open)}
      />

      {/* Share modal overlay */}
      <ShareMenu
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        onShareNow={onShareNow}
        onCopyLink={handleCopyLink}
      />
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    createdAt: PropTypes.number.isRequired,
    reaction: PropTypes.string,
    baseReactionCount: PropTypes.number.isRequired,
    shareCount: PropTypes.number.isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.number.isRequired,
      })
    ).isRequired,
    isShared: PropTypes.bool.isRequired,
    sharedFrom: PropTypes.shape({
      title: PropTypes.string,
      image: PropTypes.string,
      createdAt: PropTypes.number.isRequired,
      author: PropTypes.string.isRequired,
    }),
  }).isRequired,
  now: PropTypes.number.isRequired,
  removePost: PropTypes.func.isRequired,
  setReaction: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired,
  onOpenModal: PropTypes.func.isRequired,
};

export default Post;
