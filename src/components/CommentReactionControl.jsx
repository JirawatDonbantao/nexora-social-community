import PropTypes from "prop-types";
import { reactions } from "../constants";
import { useReactionPicker } from "../hooks/useReactionPicker";
import ReactionIcon from "./ReactionIcon";

function CommentReactionControl({ selectedReaction, onSelectReaction }) {
  const {
    isOpen,
    attachControl,
    attachPicker,
    attachTrigger,
    closePicker,
    controlProps,
    triggerProps,
  } = useReactionPicker();

  function handleDefaultReaction(event) {
    if (!isOpen || event.detail === 0) {
      onSelectReaction(selectedReaction ? selectedReaction.id : "like");
      closePicker();
    }
  }

  function handleReactionSelect(reactionId) {
    onSelectReaction(reactionId);
    closePicker();
  }

  return (
    <div
      ref={attachControl}
      className="comment-like-wrapper"
      data-picker-open={isOpen}
      {...controlProps}
    >
      {isOpen && (
        <div ref={attachPicker} className="comment-reaction-picker" role="group" aria-label="เลือกความรู้สึก">
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              className={`reaction-picker-btn ${selectedReaction?.id === reaction.id ? "active" : ""}`}
              onClick={() => handleReactionSelect(reaction.id)}
              title={reaction.label}
              aria-label={reaction.label}
            >
              <ReactionIcon reaction={reaction} className="reaction-gif-sm" />
              <span className="reaction-tooltip">{reaction.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        ref={attachTrigger}
        type="button"
        className={`comment-action-btn ${selectedReaction ? "reacted" : ""}`}
        style={selectedReaction ? { color: selectedReaction.color } : undefined}
        onClick={handleDefaultReaction}
        aria-label={selectedReaction ? selectedReaction.label : "ถูกใจ"}
        aria-expanded={isOpen}
        {...triggerProps}
      >
        {selectedReaction ? (
          <>
            <ReactionIcon reaction={selectedReaction} className="reaction-gif-xs" />
            {selectedReaction.label}
          </>
        ) : (
          "ถูกใจ"
        )}
      </button>
    </div>
  );
}

CommentReactionControl.propTypes = {
  selectedReaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  onSelectReaction: PropTypes.func.isRequired,
};

export default CommentReactionControl;
