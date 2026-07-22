import PropTypes from "prop-types";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { reactions } from "../constants";
import ReactionBar from "./ReactionBar";
import ReactionIcon from "./ReactionIcon";

function StatsBar({
  totalReactions,
  commentCount,
  shareCount,
  selectedReaction,
  className,
  postId,
  onSetReaction,
  onOpenModal,
  onShareClick,
}) {
  const prefix = className || "post-stats";
  const hasInteraction = postId != null && onSetReaction;

  return (
    <div className={prefix}>
      {/* ── ฝั่งซ้าย: reaction count + comment count + share count ── */}
      <div className={`${prefix}-left`}>
        {/* Reaction — always show when interactive */}
        {hasInteraction ? (
          <ReactionBar
            postId={postId}
            selectedReaction={selectedReaction}
            onSetReaction={onSetReaction}
            compact
            totalReactions={totalReactions}
          />
        ) : totalReactions > 0 ? (
          <span className="stats-item">
            <ReactionIcon reaction={selectedReaction || reactions[0]} className="reaction-gif--sm" />
            {totalReactions}
          </span>
        ) : null}

        {/* Comment count */}
        {onOpenModal ? (
          <button type="button" className="stats-item stats-item--clickable" onClick={onOpenModal}>
            <FaRegComment />
            {commentCount > 0 && commentCount}
          </button>
        ) : (
          <span className="stats-item">
            <FaRegComment />
            {commentCount > 0 && commentCount}
          </span>
        )}

        {/* Share count */}
        {onShareClick ? (
          <button type="button" className="stats-item stats-item--clickable" onClick={onShareClick}>
            <RiShareForwardLine />
            {shareCount > 0 && shareCount}
          </button>
        ) : (
          <span className="stats-item">
            <RiShareForwardLine />
            {shareCount > 0 && shareCount}
          </span>
        )}
      </div>

      {/* ── ฝั่งขวา: reaction badges ── */}
      <div className={`${prefix}-right`}>
        {selectedReaction && (
          <div className="stats-badges">
            <ReactionIcon reaction={selectedReaction} className="stats-badge" />
          </div>
        )}
      </div>
    </div>
  );
}

StatsBar.propTypes = {
  totalReactions: PropTypes.number.isRequired,
  commentCount: PropTypes.number.isRequired,
  shareCount: PropTypes.number.isRequired,
  selectedReaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    label: PropTypes.string,
    color: PropTypes.string,
  }),
  className: PropTypes.string,
  postId: PropTypes.number,
  onSetReaction: PropTypes.func,
  onOpenModal: PropTypes.func,
  onShareClick: PropTypes.func,
};

export default StatsBar;
