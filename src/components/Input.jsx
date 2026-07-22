import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaImage, FaSmile, FaTimes, FaVideo } from "react-icons/fa";
import { PROFILE_IMAGE, PROFILE_NAME } from "../constants";
import { readImageFile } from "../utils/imageUpload";

function Input({ addPost }) {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  function onChange(event) {
    setInput(event.target.value);
  }

  function submitPost() {
    if (!input.trim() && !selectedImage) return;

    addPost({
      title: input,
      image: selectedImage,
    });
    setInput("");
    setSelectedImage(null);
  }

  function onKeyDown(event) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPost();
    }
  }

  function openImagePicker() {
    fileInputRef.current?.click();
  }

  async function onImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    try {
      setSelectedImage(await readImageFile(file));
    } catch (error) {
      setUploadError(error.message);
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="Post composer">
      <div className="composer__row">
        <img
          src={PROFILE_IMAGE}
          alt="profile"
          className="composer__avatar"
        />
        <input
          className="Post__field"
          type="text"
          placeholder={`คุณคิดอะไรอยู่ ${PROFILE_NAME.split(" ")[0]}`}
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />

        <div className="composer__quick-actions">
          <button
            type="button"
            className="composer__quick-action live"
            disabled
            title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"
            aria-label="วิดีโอสด — ฟีเจอร์เดโม"
          >
            <FaVideo />
          </button>
          <button
            type="button"
            className="composer__quick-action photo"
            onClick={openImagePicker}
            aria-label="Add photo or video"
          >
            <FaImage />
          </button>
          <button
            type="button"
            className="composer__quick-action feeling"
            disabled
            title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"
            aria-label="ความรู้สึก — ฟีเจอร์เดโม"
          >
            <FaSmile />
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="composer__preview">
          <img src={selectedImage} alt="Selected upload preview" />
          <button
            type="button"
            className="composer__remove-image"
            onClick={() => setSelectedImage(null)}
            aria-label="Remove selected image"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {uploadError && <p className="composer__upload-error" role="alert">{uploadError}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="composer__file"
        onChange={onImageChange}
      />
    </div>
  );
}

Input.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default Input;
