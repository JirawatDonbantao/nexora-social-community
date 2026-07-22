import PropTypes from "prop-types";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { reactions } from "../constants";
import { useReactionPicker } from "../hooks/useReactionPicker";
import ReactionIcon from "./ReactionIcon";

function ReactionBar({ postId, selectedReaction, onSetReaction, compact, totalReactions }) {
  const {
    isOpen,
    attachControl,
    attachPicker,
    attachTrigger,
    closePicker,
    controlProps,
    triggerProps,
  } = useReactionPicker();

  function handleReactionSelect(reactionId) {
    onSetReaction(postId, reactionId);
    closePicker();
  }

  function renderPicker() {
    if (!isOpen) return null;

    return (
      <div ref={attachPicker} className="reaction-picker" role="group" aria-label="เลือกความรู้สึก">
        {reactions.map((reaction) => (
          <button
            type="button"
            key={reaction.id}
            onClick={() => handleReactionSelect(reaction.id)}
            title={reaction.label}
            aria-label={reaction.label}
          >
            <ReactionIcon reaction={reaction} />
          </button>
        ))}
      </div>
    );
  }

  // ── Compact mode: แสดงใน stats bar เป็น icon + count (ไม่มีปุ่มใหญ่) ──
  if (compact) {
    return (
        <div
          ref={attachControl}
          className="reaction-control reaction-control--compact"
          data-picker-open={isOpen}
          {...controlProps}
      >
        {renderPicker()}

        <button
          ref={attachTrigger}
          type="button"
          className="stats-item stats-item--reaction"
          onClick={() => onSetReaction(postId, "like")}
          aria-label={selectedReaction ? selectedReaction.label : "ถูกใจ"}
          aria-expanded={isOpen}
          {...triggerProps}
        >
          {selectedReaction ? (
            <ReactionIcon reaction={selectedReaction} className="reaction-gif--sm" />
          ) : (
            <FaRegThumbsUp />
          )}
          {totalReactions > 0 && <span>{totalReactions}</span>}
        </button>
      </div>
    );
  }

  // ── Full mode: ปุ่มใหญ่แบบเดิม (ใช้ใน modal) ──
  return (
    <div
      ref={attachControl}
      className="reaction-control"
      data-picker-open={isOpen}
      {...controlProps}
    >
      {renderPicker()}

      <button
        ref={attachTrigger}
        type="button"
        className={`action-btn ${selectedReaction ? "selected" : ""}`}
        style={
          selectedReaction
            ? { color: selectedReaction.color }
            : undefined
        }
        onClick={() => onSetReaction(postId, "like")}
        aria-expanded={isOpen}
        {...triggerProps}
      >
        {selectedReaction ? (
          <span className="reaction-button__emoji">
            <ReactionIcon reaction={selectedReaction} />
          </span>
        ) : (
          <FaThumbsUp />
        )}
        {selectedReaction ? ` ${selectedReaction.label}` : " ถูกใจ"}
      </button>
    </div>
  );
}

ReactionBar.propTypes = {
  postId: PropTypes.number.isRequired,
  selectedReaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  onSetReaction: PropTypes.func.isRequired,
  compact: PropTypes.bool,
  totalReactions: PropTypes.number,
};

export default ReactionBar;
