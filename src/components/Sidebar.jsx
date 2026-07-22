import {
  FaHome,
  FaUserFriends,
  FaStore,
  FaVideo,
  FaClock,
  FaBookmark,
  FaChevronDown,
  FaChevronUp,
  FaUsers
} from "react-icons/fa";
import { useState } from "react";
import { PROFILE_IMAGE, PROFILE_NAME } from "../constants";
import { shortcuts } from "../data/sidebarData";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="sidebar">
      
      {/* ส่วนที่ 1: โปรไฟล์ผู้ใช้ */}
      <div className="sidebar__profile sidebar__item--static">
        <img src={PROFILE_IMAGE} alt="profile" />
        <h4>{PROFILE_NAME}</h4>  
      </div>

      {/* ส่วนที่ 2: เมนูหลัก */}
      <ul>
        <li className="sidebar__item--static"><FaHome /> <span>หน้าหลัก</span></li>
        <li className="sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"><FaUserFriends /> <span>เพื่อน</span></li>
        <li className="sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"><FaClock /> <span>ความทรงจำ</span></li>
        <li className="sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"><FaUsers /> <span>กลุ่ม</span></li>

        {/* เมนูที่ซ่อนอยู่ — แสดงเมื่อกดดูเพิ่มเติม */}
        {isExpanded && (
          <>
            <li className="sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"><FaBookmark /> <span>ที่บันทึกไว้</span></li>
            <li className="sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"><FaVideo /> <span>วิดีโอสั้น</span></li>
            <li className="sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน"><FaStore /> <span>ตลาดชุมชน</span></li>
          </>
        )}

        {/* ปุ่มดูเพิ่มเติม / ซ่อน */}
        <li
          role="button"
          tabIndex={0}
          onClick={() => setIsExpanded((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsExpanded((prev) => !prev);
            }
          }}
        >
          {isExpanded
            ? <FaChevronUp className="icon-gray" />
            : <FaChevronDown className="icon-gray" />
          }
          <span>{isExpanded ? "ซ่อน" : "ดูเพิ่มเติม"}</span>
        </li>
      </ul>

      {/* เส้นคั่นแบ่งส่วน */}
      <hr className="sidebar__divider" />

      {/* ส่วนที่ 3: ทางลัดของคุณ */}
      <div className="sidebar__section-title">ทางลัดของคุณ</div>

      <ul className="sidebar__shortcuts">
        {shortcuts.map((shortcut) => (
          <li key={shortcut.id} className="shortcut-item sidebar__item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน">
            <img src={shortcut.avatar} alt={shortcut.name} />
            <span>{shortcut.name}</span>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Sidebar;
