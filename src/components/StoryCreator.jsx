import { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  FaCog,
  FaFont,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import { BRAND_APP_ICON, BRAND_NAME } from "../brand";
import { PROFILE_IMAGE, PROFILE_NAME } from "../constants";
import { readImageFile } from "../utils/imageUpload";
import { useDialogA11y } from "../hooks/useDialogA11y";

function StoryCreator({ onAddImageStory, onAddTextStory, onClose }) {
  const [isTextMode, setIsTextMode] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useDialogA11y({ dialogRef, initialFocusRef: closeButtonRef, onClose: handleClose });

  function handleClose() {
    setIsTextMode(false);
    setStoryText("");
    setUploadError("");
    onClose();
  }

  function openImagePicker() {
    fileInputRef.current?.click();
  }

  async function onImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    try {
      onAddImageStory(await readImageFile(file));
      handleClose();
    } catch (error) {
      setUploadError(error.message);
    } finally {
      event.target.value = "";
    };
  }

  function handleAddTextStory() {
    if (!storyText.trim()) return;
    onAddTextStory(storyText);
    handleClose();
  }

  return (
    <div ref={dialogRef} className="story-creator" role="dialog" aria-modal="true" aria-labelledby="story-creator-title" tabIndex={-1}>
      <aside className="story-creator__sidebar">
        <div className="story-creator__top">
          <button ref={closeButtonRef} type="button" className="story-creator__close" onClick={handleClose} aria-label="ปิดหน้าสร้างสตอรี่">
            <FaTimes />
          </button>
          <img className="story-creator__logo" src={BRAND_APP_ICON} alt={BRAND_NAME} />
        </div>
        <div className="story-creator__heading">
          <h2 id="story-creator-title">สตอรี่ของคุณ</h2>
          <button
            type="button"
            disabled
            title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"
            aria-label="ตั้งค่าสตอรี่ — ฟีเจอร์เดโม"
          >
            <FaCog />
          </button>
        </div>
        <div className="story-creator__profile">
          <img src={PROFILE_IMAGE} alt="profile" />
          <strong>{PROFILE_NAME}</strong>
        </div>
      </aside>
      <main className="story-creator__main">
        <div className="story-creator__cards">
          <button type="button" className="story-option story-option--photo" onClick={openImagePicker}>
            <span><FaImage /></span>
            <strong>สร้างสตอรี่รูปภาพหรือวิดีโอ</strong>
          </button>
          <button type="button" className="story-option story-option--text" onClick={() => setIsTextMode(true)}>
            <span><FaFont /></span>
            <strong>สร้างสตอรี่ข้อความ</strong>
          </button>
        </div>
        {uploadError && <p className="story-creator__upload-error" role="alert">{uploadError}</p>}
        {isTextMode && (
          <div className="story-text-panel">
            <textarea
              value={storyText}
              onChange={(event) => setStoryText(event.target.value)}
              placeholder="เริ่มพิมพ์ข้อความสตอรี่..."
              autoFocus
            />
            <button type="button" onClick={handleAddTextStory}>แชร์ไปยังสตอรี่</button>
          </div>
        )}
      </main>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="story-creator__file" tabIndex={-1} onChange={onImageChange} />
    </div>
  );
}

StoryCreator.propTypes = {
  onAddImageStory: PropTypes.func.isRequired,
  onAddTextStory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StoryCreator;
