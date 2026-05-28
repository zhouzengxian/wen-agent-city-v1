import { create } from 'zustand';
import { agentMoments, getTodayPosts } from '../data/agentMoments';

// 从 localStorage 读取
function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem('wen_city_' + key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}
function saveToStorage(key, value) {
  try { localStorage.setItem('wen_city_' + key, JSON.stringify(value)); } catch {}
}

const initialProfile = loadFromStorage('profile', null);
const initialFriends = loadFromStorage('friends', []);
const initialLikes = loadFromStorage('likes', {});

const useCityStore = create((set, get) => ({
  // ...原有...
  selectedAgent: null,
  dialogueVisible: false,
  dialogueText: '',
  bubblePosition: { x: 0, y: 0 },

  demoPlaying: false, demoPhase: null, demoDialogue: null,
  demoButterflyPos: null, demoProgress: 0,
  demoHighlightAgent: null, // 当前高亮的Agent ID
  traceActive: false, traceIndex: 0,
  residentActive: false, residentProgress: 0,
  autoRotate: false,

  // ===== 朋友圈系统 =====
  phoneOpen: false,
  phoneScreen: 'moments', // moments | contacts | profile

  // 用户
  userProfile: initialProfile,

  // 好友列表（agent id数组）
  friends: initialFriends,

  // 点赞 { 'agentId|postIndex': true }
  likes: initialLikes,

  // 当前展示的朋友圈
  getMomentsFeed: () => {
    const friends = get().friends;
    const all = [];
    friends.forEach((agentId) => {
      const agentData = agentMoments[agentId];
      if (!agentData) return;
      const todayPosts = getTodayPosts(agentId);
      todayPosts.forEach((post) => {
        all.push({
          agentId,
          name: agentData.name, avatar: agentData.avatar, color: agentData.color,
          text: post.text, image: post.image, time: post.time,
          postIndex: post.postIndex,
          liked: !!get().likes[`${agentId}|${post.postIndex}`],
        });
      });
    });
    all.sort((a, b) => b.time.localeCompare(a.time));
    return all;
  },

  // 操作
  togglePhone: () => set((s) => ({ phoneOpen: !s.phoneOpen })),
  openPhone: () => set({ phoneOpen: true }),
  closePhone: () => set({ phoneOpen: false }),
  setPhoneScreen: (screen) => set({ phoneScreen: screen }),

  // 注册/登录
  loginUser: (name, avatar) => {
    const profile = { name, avatar, loginTime: Date.now() };
    saveToStorage('profile', profile);
    set({ userProfile: profile, phoneScreen: 'moments' });
  },
  logoutUser: () => {
    saveToStorage('profile', null);
    set({ userProfile: null, friends: [], likes: {} });
  },

  // 好友
  addFriend: (agentId) => {
    const friends = [...get().friends, agentId];
    saveToStorage('friends', friends);
    set({ friends });
  },
  removeFriend: (agentId) => {
    const friends = get().friends.filter((f) => f !== agentId);
    saveToStorage('friends', friends);
    set({ friends });
  },
  isFriend: (agentId) => get().friends.includes(agentId),

  // 点赞
  toggleLike: (agentId, postIndex) => {
    const key = `${agentId}|${postIndex}`;
    const likes = { ...get().likes };
    if (likes[key]) { delete likes[key]; }
    else { likes[key] = true; }
    saveToStorage('likes', likes);
    set({ likes });
  },
  isLiked: (agentId, postIndex) => !!get().likes[`${agentId}|${postIndex}`],

  // 原有方法
  selectAgent: (agent, screenPos) => set({
    selectedAgent: agent, dialogueVisible: true,
    dialogueText: agent.dialogue, bubblePosition: screenPos,
  }),
  deselectAgent: () => set({ selectedAgent: null, dialogueVisible: false, dialogueText: '' }),
  startDemo: () => set({
    demoPlaying: true, demoPhase: 'aerial', demoProgress: 0,
    demoDialogue: null, demoButterflyPos: null,
    demoHighlightAgent: null,
    traceActive: false, traceIndex: 0,
    residentActive: false, residentProgress: 0,
  }),
  endDemo: () => set({
    demoPlaying: false, demoPhase: null, demoDialogue: null,
    demoButterflyPos: null, demoProgress: 0,
    demoHighlightAgent: null,
    traceActive: false, traceIndex: 0,
    residentActive: false, residentProgress: 0,
  }),
  setDemoPhase: (p) => set({ demoPhase: p }),
  setDemoDialogue: (d) => set({ demoDialogue: d }),
  setDemoHighlightAgent: (id) => set({ demoHighlightAgent: id }),
  setDemoButterflyPos: (pos) => set({ demoButterflyPos: pos }),
  setDemoProgress: (p) => set({ demoProgress: p }),
  setTraceActive: (v) => set({ traceActive: v }),
  advanceTrace: () => set((s) => ({ traceIndex: s.traceIndex + 1 })),
  resetTrace: () => set({ traceIndex: 0 }),
  setResidentActive: (v) => set({ residentActive: v }),
  setResidentProgress: (p) => set({ residentProgress: p }),
  setAutoRotate: (v) => set({ autoRotate: v }),
}));

export default useCityStore;
