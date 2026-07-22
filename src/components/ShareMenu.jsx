import PropTypes from "prop-types";
import { FaGlobeAsia, FaCopy } from "react-icons/fa";

function ShareMenu({ isOpen, onClose, onShareNow, onCopyLink }) {
  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>แชร์โพสต์</h3>
        <button type="button" onClick={onShareNow}>
          <FaGlobeAsia />
          <span>
            <strong>แชร์เลย</strong>
            <small>ตั้งค่าเป็นสาธารณะ</small>
          </span>
        </button>

        <button type="button" onClick={onCopyLink}>
          <FaCopy />
          <span>
            <strong>คัดลอกลิงก์</strong>
            <small>ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน</small>
          </span>
        </button>
      </div>
    </div>
  );
}

ShareMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onShareNow: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired,
};

export default ShareMenu;
