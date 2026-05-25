// Demo完整演示脚本 - 27秒
export const demoScript = {
  title: '文渊城 · 完整叙事Demo',
  totalDuration: 27,
  scenes: [
    {
      id: 'aerial',
      name: '苍穹俯瞰',
      duration: 3,
      description: '星云粒子汇聚成城邦轮廓',
    },
    {
      id: 'descent',
      name: '城邦降临',
      duration: 3, // 3-6s
      description: '六坊灯笼亮起，石板路显现',
    },
    {
      id: 'workshop',
      name: '坊间漫游',
      duration: 3, // 6-9s
      description: '镜头掠至匠作工坊',
    },
    {
      id: 'encounter',
      name: '跨界偶遇',
      duration: 3, // 9-12s
      description: '蝶纹沿贝塞尔曲线飞向鲁明',
      butterflyFlight: {
        start: [2, 1.5, 1],
        control: [0, 2.5, -0.5],
        end: [-2.5, 0.5, -1.5],
      },
    },
    {
      id: 'dialogue',
      name: 'Agent对话',
      duration: 8, // 12-20s
      description: '蝶纹与鲁明的跨界交流',
      dialogues: [
        { speaker: 'diewen', time: 0.5, text: '老先生，我翅膀上的卷草纹，和您斗拱上的彩画好像！' },
        { speaker: 'luban', time: 3.5, text: '这是唐代流传下来的纹样，一草一木皆有来历。你翅上的团花，我在《营造法式》的彩画作里见过。' },
        { speaker: 'diewen', time: 7, text: '原来纹样不会老，只是换了栖身的地方！待我去告诉绣娘！' },
      ],
    },
    {
      id: 'trace',
      name: '人脉溯源',
      duration: 4, // 20-24s
      description: '脉络网络爆发，关系路径依次高亮',
      tracePath: [
        { from: 'diewen', to: 'xiuniang', label: '同属纹样体系' },
        { from: 'xiuniang', to: 'luban', label: '纹样与营造互鉴' },
        { from: 'luban', to: 'yingta', label: '木构技艺传承' },
        { from: 'yingta', to: 'suzi', label: '题咏应县木塔' },
      ],
    },
    {
      id: 'welcome',
      name: '新人入驻',
      duration: 3, // 24-27s
      description: '墨池走入城门，新居所升起',
    },
  ],
};

export const particleConverge = {
  particleCount: 800,
  startRadius: 25,
  endRadius: 11,
  height: 8,
};
