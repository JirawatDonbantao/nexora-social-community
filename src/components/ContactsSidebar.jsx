import { FaSearch, FaEllipsisH, FaPlus } from "react-icons/fa";
import PropTypes from "prop-types";
import { contacts, groupChats } from "../data/contactsData";

function ContactsSidebar({ searchQuery }) {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("th-TH");
  const visibleContacts = normalizedQuery
    ? contacts.filter((contact) => contact.name.toLocaleLowerCase("th-TH").includes(normalizedQuery))
    : contacts;
  const visibleGroupChats = normalizedQuery
    ? groupChats.filter((group) => group.name.toLocaleLowerCase("th-TH").includes(normalizedQuery))
    : groupChats;

  return (
    <aside className="contacts-sidebar" aria-label="ผู้ติดต่อ">

      {/* ส่วนหัว — ผู้ติดต่อ */}
      <div className="contacts__header">
        <h3>ผู้ติดต่อ</h3>
        <div className="contacts__header-actions">
          <button type="button" disabled title="ใช้ช่องค้นหาหลักด้านบน" aria-label="ค้นหาผู้ติดต่อผ่านช่องค้นหาหลัก">
            <FaSearch />
          </button>
          <button type="button" disabled title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน" aria-label="ตัวเลือกผู้ติดต่อ — ฟีเจอร์เดโม">
            <FaEllipsisH />
          </button>
        </div>
      </div>

      {/* รายชื่อผู้ติดต่อ */}
      <ul className="contacts__list">
        {visibleContacts.map((contact) => (
          <li key={contact.id} className="contact-item">
            <div className="contact-item__avatar-wrap">
              <img src={contact.avatar} alt={contact.name} />
              {contact.online && <span className="contact-item__online" />}
              {contact.lastActive && (
                <span className="contact-item__last-active">{contact.lastActive}</span>
              )}
            </div>
            <span className="contact-item__name">
              {contact.name}
              {contact.verified && <span className="contact-item__verified">✓</span>}
            </span>
          </li>
        ))}
        {normalizedQuery && visibleContacts.length === 0 && (
          <li className="contacts__empty">ไม่พบผู้ติดต่อ</li>
        )}
      </ul>

      {/* เส้นคั่น */}
      <hr className="contacts__divider" />

      {/* ส่วนแชทกลุ่ม */}
      <div className="contacts__header">
        <h3>แชทกลุ่ม</h3>
      </div>

      <ul className="contacts__list">
        {visibleGroupChats.map((group) => (
          <li key={group.id} className="contact-item">
            <div className="contact-item__avatar-wrap">
              <img src={group.avatar} alt={group.name} className="contact-item__group-avatar" />
              {group.lastActive && (
                <span className="contact-item__last-active">{group.lastActive}</span>
              )}
            </div>
            <span className="contact-item__name">{group.name}</span>
          </li>
        ))}

        {normalizedQuery && visibleGroupChats.length === 0 && (
          <li className="contacts__empty">ไม่พบแชทกลุ่ม</li>
        )}

        {/* ปุ่มสร้างแชทกลุ่ม */}
        <li className="contact-item contact-item--create contact-item--demo" aria-disabled="true" title="ฟีเจอร์เดโม — ยังไม่พร้อมใช้งาน">
          <span className="contact-item__create-icon">
            <FaPlus />
          </span>
          <span className="contact-item__name">สร้างแชทกลุ่ม</span>
        </li>
      </ul>
    </aside>
  );
}

ContactsSidebar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};

export default ContactsSidebar;
