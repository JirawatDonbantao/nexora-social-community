import { DEMO_PROFILE } from "./data/demoProfiles";
import angryReaction from "./assets/reactions/angry.gif";
import careReaction from "./assets/reactions/care.gif";
import hahaReaction from "./assets/reactions/haha.gif";
import likeReaction from "./assets/reactions/like.gif";
import loveReaction from "./assets/reactions/love.gif";
import sadReaction from "./assets/reactions/sad.gif";
import wowReaction from "./assets/reactions/wow.gif";

export const PROFILE_IMAGE = DEMO_PROFILE.avatar;
export const PROFILE_NAME = DEMO_PROFILE.name;

export const reactions = [
  { id: "like", label: "ถูกใจ", image: likeReaction, color: "#4f46e5" },
  { id: "love", label: "รักเลย", image: loveReaction, color: "#e11d48" },
  { id: "care", label: "ห่วงใย", image: careReaction, color: "#d97706" },
  { id: "haha", label: "ฮ่าๆ", image: hahaReaction, color: "#d97706" },
  { id: "wow", label: "ว้าว", image: wowReaction, color: "#d97706" },
  { id: "sad", label: "เศร้า", image: sadReaction, color: "#2563eb" },
  { id: "angry", label: "โกรธ", image: angryReaction, color: "#dc2626" },
];
