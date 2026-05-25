import { create } from 'zustand';

const useCityStore = create((set) => ({
  // 当前选中的Agent（null = 没有选中）
  selectedAgent: null,
  // 对话气泡显示状态
  dialogueVisible: false,
  // 对话文字
  dialogueText: '',
  // 气泡屏幕坐标
  bubblePosition: { x: 0, y: 0 },

  selectAgent: (agent, screenPos) => set({
    selectedAgent: agent,
    dialogueVisible: true,
    dialogueText: agent.dialogue,
    bubblePosition: screenPos,
  }),

  deselectAgent: () => set({
    selectedAgent: null,
    dialogueVisible: false,
    dialogueText: '',
  }),
}));

export default useCityStore;
