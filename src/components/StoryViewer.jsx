import { useRef } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import { useDialogA11y } from "../hooks/useDialogA11y";

function StoryViewer({ story, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useDialogA11y({ dialogRef, initialFocusRef: closeButtonRef, onClose, isOpen: Boolean(story) });

  if (!story) return null;

  return (
    <div ref={dialogRef} className="story-viewer-overlay" role="dialog" aria-modal="true" aria-labelledby="story-viewer-title" tabIndex={-1}>
      {/* ปุ่มปิด */}
      <button ref={closeButtonRef} type="button" className="story-viewer-close" onClick={onClose} aria-label="ปิดสตอรี่">
        <FaTimes />
      </button>

      <div className="story-viewer-content">
        {/* ส่วนหัวการ์ด (Avatar & Name) */}
        <div className="story-viewer-header">
          <img src={story.avatar} alt={story.name} />
          <span id="story-viewer-title">สตอรี่ของ {story.name}</span>
        </div>

        {/* เนื้อหา สตอรี่ */}
        <div className="story-viewer-body">
          {story.type === "text" ? (
            <div className="story-viewer-text">{story.text}</div>
          ) : (
            <img src={story.image} alt={`สตอรี่ของ ${story.name}`} />
          )}
        </div>
      </div>
    </div>
  );
}

StoryViewer.propTypes = {
  story: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["text", "image"]).isRequired,
    text: PropTypes.string,
    image: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default StoryViewer;
