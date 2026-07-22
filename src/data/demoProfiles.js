import kianAvatar from "../assets/demo/avatars/kian.webp";
import miraAvatar from "../assets/demo/avatars/mira.webp";
import naraAvatar from "../assets/demo/avatars/nara.webp";
import soraAvatar from "../assets/demo/avatars/sora.webp";
import theoAvatar from "../assets/demo/avatars/theo.webp";
import storyAurora from "../assets/demo/story-aurora.svg";
import storyOrbit from "../assets/demo/story-orbit.svg";
import storyPulse from "../assets/demo/story-pulse.svg";
import storyViolet from "../assets/demo/story-violet.svg";
import { BRAND_AVATAR_ICON } from "../brand";

export const DEMO_PROFILE = { name: "Nara Venn", avatar: naraAvatar };

const avatarPool = [miraAvatar, kianAvatar, naraAvatar, theoAvatar, soraAvatar];
const demoNames = [
  "Aira Vale", "Kian Moss", "Mira Sol", "Theo Lane", "Rina Hart",
  "Leo North", "Nova Reed", "Finn Arlo", "Sora Wynn", "Kai Ember",
  "Elin Grove", "Owen Sky", "Luma Ray", "Ryo Vale", "Sage Kori",
  "Zara Quinn", "Iris Bloom", "Noel Ash", "Ava Rune", "Milo Dean",
];
const demoPeople = demoNames.map((name, index) => [name, avatarPool[index % avatarPool.length]]);

export const DEMO_CONTACTS = [
  { id: 1, name: "Nexora AI", avatar: BRAND_AVATAR_ICON, online: true, verified: true },
  ...demoPeople.map(([name, avatar], index) => ({ id: index + 2, name, avatar, ...(index % 4 === 2 ? { lastActive: "11 นาที" } : { online: true }) })),
];

export const DEMO_GROUP_CHATS = [
  { id: 1, name: "Nexora Creators", avatar: soraAvatar, lastActive: "1 ชั่วโมง" },
  { id: 2, name: "Campus Connect", avatar: theoAvatar },
  { id: 3, name: "Design & Dev Lab", avatar: miraAvatar },
];

export const DEMO_SHORTCUTS = [
  { id: 1, name: "Nexora Creators Hub", avatar: naraAvatar },
  { id: 2, name: "Portfolio Makers", avatar: miraAvatar },
  { id: 3, name: "Tech & Design Circle", avatar: kianAvatar },
  { id: 4, name: "Career Launchpad", avatar: theoAvatar },
  { id: 5, name: "Data Lab Community", avatar: soraAvatar },
];

export const DEMO_STORIES = [
  { id: 1, name: "Nara", image: storyAurora, avatar: naraAvatar, type: "image" },
  { id: 2, name: "Aira", image: storyPulse, avatar: miraAvatar, type: "image" },
  { id: 3, name: "Kian", image: storyOrbit, avatar: kianAvatar, type: "image" },
  { id: 4, name: "Mira", image: storyViolet, avatar: miraAvatar, type: "image" },
];
