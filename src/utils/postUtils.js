// src/utils/postUtils.js
// Shared utilities for Post and PostModal components

// Re-export from central constants for backward compatibility
export { PROFILE_IMAGE, PROFILE_NAME, reactions } from "../constants";

export function formatRelativeTime(timestamp, now) {
  const diffInSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffInSeconds < 60) return "เพิ่งเมื่อสักครู่";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;

  if (diffInHours < 48) return "เมื่อวานนี้";

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}
