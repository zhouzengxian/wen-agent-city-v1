export const agents = [
  // ===== 原有6个 =====
  {
    id: 'luban', name: '鲁明', title: '木构技艺匠师', emoji: '🔨',
    position: [-3, 0, -2], district: 'craftsman', color: '#8B5E3C',
    description: '博学沉稳的木匠，手持曲尺，深谙营造法式',
    dialogue: '斗拱之妙，在于不用一钉一铆，全凭榫卯咬合。这千年木构的智慧，可比绣花针下的功夫还要精细。',
  },
  {
    id: 'xiuniang', name: '绣娘', title: '刺绣纹样匠人', emoji: '🧵',
    position: [3, 0, -3], district: 'pattern', color: '#C73E3A',
    description: '心思精巧的手作匠人，指尖丝线缠绕千年华彩',
    dialogue: '一针一线皆是岁月。这团花纹上的每一片花瓣，都藏着唐代绣娘的心意。',
  },
  {
    id: 'yingta', name: '应塔', title: '应县木塔', emoji: '🏯',
    position: [-4, 0, 2], district: 'craftsman', color: '#5C8D6E',
    description: '千年木塔化身的智慧存在，檐角风铃诉说着世纪风雨',
    dialogue: '我在此伫立千年，见过斗拱上彩画褪色又重绘，风铃响过无数春秋。鲁明师傅的刨子里，也有我的影子。',
  },
  {
    id: 'suzi', name: '苏子', title: '文学思想大家', emoji: '📜',
    position: [0, 0, 4], district: 'thought', color: '#6B7B8D',
    description: '豁达豪放的东坡居士，善用诗词作答，一蓑烟雨任平生',
    dialogue: '横看成岭侧成峰，远近高低各不同。这城邦里的万千智慧，正如庐山面目，换个角度便是另一番天地。',
  },
  {
    id: 'diewen', name: '蝶纹', title: '蝴蝶纹样精灵', emoji: '🦋',
    position: [2, 0.5, 1], district: 'pattern', color: '#C77DB5',
    description: '苏绣蝴蝶纹样化身的灵动少女，好奇心旺盛，最爱跨界串门',
    dialogue: '我的翅上纹路，是苏绣匠人用百种针法绣出的。咦——鲁明师傅斗拱上那卷草纹，怎么跟我的翅膀上的花纹这么像？',
  },
  {
    id: 'mochi', name: '墨池', title: '当代求知者', emoji: '🌙',
    position: [1, 0, -4], district: 'entrance', color: '#B8C5D6',
    description: '属于你的专属智能体，手持空白卷轴，准备入驻这座数字城邦',
    dialogue: '初入文渊城，愿以空白卷轴录下诸君智慧。千年文脉在前，晚辈当虚心求教。',
  },

  // ===== 新增5个 =====
  {
    id: 'libai', name: '太白', title: '诗酒剑仙', emoji: '🍶',
    position: [-1, 0, 7], district: 'poetry', color: '#C5A56E',
    description: '李白化身，仗剑行吟的诗仙，一杯浊酒邀明月，绣口一吐便是半个盛唐',
    dialogue: '天生我材必有用，千金散尽还复来。这城邦中，吾与苏子对饮，与乐伶和歌，快哉！',
  },
  {
    id: 'qingci', name: '青瓷', title: '青瓷匠人', emoji: '🏺',
    position: [-6, 0, -3], district: 'craftsman', color: '#5A9E8A',
    description: '越窑青瓷之魂，釉色千峰翠，器物通古今',
    dialogue: '泥与火的艺术，始于抟土为器，成于千度窑变。鲁明师傅的木模，也曾是我出窑的形制之依。',
  },
  {
    id: 'mojing', name: '墨经', title: '墨家典籍', emoji: '📖',
    position: [-5, 0, 5], district: 'literature', color: '#4A5A5A',
    description: '《墨子》经典化身，兼爱非攻，重实践重逻辑，沉稳如古井',
    dialogue: '兼相爱，交相利。百工之事，皆圣人之所为也。鲁明之榫卯、青瓷之窑火，皆在墨家所论之中。',
  },
  {
    id: 'yueling', name: '乐伶', title: '乐舞艺人', emoji: '🎵',
    position: [5, 0, 2], district: 'music', color: '#D4826E',
    description: '盛唐乐舞精灵，琵琶弦上春水流，裙摆旋转如飞天',
    dialogue: '霓裳羽衣曲未终，太白已醉倒案前。诗在弦上，舞在词间，这城邦怎少得了妙音相伴？',
  },
  {
    id: 'xingtu', name: '星图', title: '天文星官', emoji: '⭐',
    position: [-5, 0, 7], district: 'astronomy', color: '#4A5A8A',
    description: '《甘石星经》化身，夜观天象的深邃星官，知晓宇宙秩序',
    dialogue: '二十八宿运转如斯，应塔的朝向暗合北辰，苏子的赤壁赋中有星象流转。天地之道，尽在俯仰之间。',
  },
];

// 知识图谱连线
export const connections = [
  // 原有
  { from: 'luban', to: 'yingta', label: '木构技艺传承' },
  { from: 'luban', to: 'diewen', label: '卷草纹与斗拱彩画' },
  { from: 'diewen', to: 'xiuniang', label: '同属纹样体系' },
  { from: 'xiuniang', to: 'luban', label: '纹样与营造互鉴' },
  { from: 'suzi', to: 'yingta', label: '题咏应县木塔' },
  { from: 'suzi', to: 'mochi', label: '古今智慧对话' },
  { from: 'mochi', to: 'luban', label: '求知营造之道' },

  // 新增
  { from: 'libai', to: 'suzi', label: '诗词唱和共鸣' },
  { from: 'libai', to: 'yueling', label: '诗与乐共舞' },
  { from: 'qingci', to: 'luban', label: '陶瓷木模共生' },
  { from: 'qingci', to: 'xiuniang', label: '青花纹样互鉴' },
  { from: 'qingci', to: 'yingta', label: '建筑琉璃装饰' },
  { from: 'mojing', to: 'luban', label: '墨家机关术' },
  { from: 'mojing', to: 'suzi', label: '百家争鸣' },
  { from: 'mojing', to: 'qingci', label: '百工之事' },
  { from: 'yueling', to: 'xiuniang', label: '乐舞服饰纹样' },
  { from: 'xingtu', to: 'yingta', label: '天文与建筑朝向' },
  { from: 'xingtu', to: 'suzi', label: '赤壁赋中星象' },
  { from: 'xingtu', to: 'mojing', label: '宇宙秩序之辨' },
  { from: 'mochi', to: 'libai', label: '初学诗词之道' },
  { from: 'mochi', to: 'xingtu', label: '仰望星空之问' },
];

// 坊区
export const districts = [
  { id: 'craftsman', name: '匠作工坊', color: '#8B5E3C', position: [-5, 0, -2], radius: 4.5, lanternColor: '#D4A574' },
  { id: 'pattern', name: '纹样绣坊', color: '#C73E3A', position: [4, 0, -2], radius: 4, lanternColor: '#E8A0A0' },
  { id: 'thought', name: '思想茶馆', color: '#6B7B8D', position: [0, 0, 5], radius: 3, lanternColor: '#A0B0C0' },
  { id: 'literature', name: '经史子集坊', color: '#B8860B', position: [-4, 0, 5], radius: 3, lanternColor: '#E8C860' },
  { id: 'poetry', name: '诗文雅集', color: '#C5A56E', position: [-1, 0, 7], radius: 3, lanternColor: '#E8D5A3' },
  { id: 'music', name: '乐舞坊', color: '#D4826E', position: [5, 0, 2], radius: 3, lanternColor: '#E8B0A0' },
  { id: 'astronomy', name: '观星阁', color: '#4A5A8A', position: [-5, 0, 7], radius: 3, lanternColor: '#8A9AC8' },
  { id: 'entrance', name: '城邦入口', color: '#B8C5D6', position: [1, 0, -5], radius: 2.5, lanternColor: '#D8E0F0' },
];
