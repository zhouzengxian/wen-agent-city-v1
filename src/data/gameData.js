// ============================================================
// 文渊城 v2 — 1000 Agent 人类知识星河
// 12坊区 × 三层架构 (40+180+780) × 跨时空连线
// ============================================================

// ==================== 工具函数 ====================
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function hexColor(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function lerpColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1,3), 16), g1 = parseInt(c1.slice(3,5), 16), b1 = parseInt(c1.slice(5,7), 16);
  const r2 = parseInt(c2.slice(1,3), 16), g2 = parseInt(c2.slice(3,5), 16), b2 = parseInt(c2.slice(5,7), 16);
  return hexColor(r1 + (r2-r1)*t, g1 + (g2-g1)*t, b1 + (b2-b1)*t);
}

// ==================== 12坊区定义 ====================
export const districts = [
  // ---- 哲学轴 ----
  { id: 'eastern_wisdom', name: '东方哲思', color: '#D4A574', position: [-10.4, 0, -6], radius: 4.2, lanternColor: '#F0D0A0' },
  { id: 'western_philosophy', name: '西方哲学', color: '#7B8FAB', position: [-12, 0, 0], radius: 4.2, lanternColor: '#A0B8D8' },
  { id: 'east_west_bridge', name: '东西对话', color: '#9B8EC4', position: [-6, 0, -10.4], radius: 3.8, lanternColor: '#C0B0E8' },
  // ---- 文学与神话轴 ----
  { id: 'literary_imagination', name: '文学想象', color: '#5A8A7A', position: [0, 0, -12], radius: 4.0, lanternColor: '#80C0A0' },
  { id: 'world_mythologies', name: '东西神话', color: '#C47A4A', position: [6, 0, -10.4], radius: 4.0, lanternColor: '#E8A870' },
  // ---- AI与互联网轴 ----
  { id: 'ai_galaxy', name: 'AI星云', color: '#4A8AF4', position: [10.4, 0, 6], radius: 4.5, lanternColor: '#80B8FF' },
  { id: 'internet_thinking', name: '互联网思维', color: '#4AC4A8', position: [6, 0, 10.4], radius: 4.0, lanternColor: '#80E8D0' },
  // ---- 建筑与艺术轴 ----
  { id: 'architecture', name: '建筑星团', color: '#C4A44A', position: [-10.4, 0, 6], radius: 4.5, lanternColor: '#E8D080' },
  { id: 'art_avantgarde', name: '艺术先锋', color: '#C44A8A', position: [-6, 0, 10.4], radius: 4.2, lanternColor: '#E880B8' },
  // ---- 设计、复杂科学 ----
  { id: 'complexity_science', name: '复杂科学', color: '#5A8AC4', position: [12, 0, 0], radius: 3.8, lanternColor: '#80B0E8' },
  { id: 'design_thinking', name: '设计思维', color: '#6AC46A', position: [0, 0, 12], radius: 3.8, lanternColor: '#90E890' },
  // ---- 入口 ----
  { id: 'knowledge_hub', name: '知识枢纽', color: '#B8C5D6', position: [10.4, 0, -6], radius: 3.2, lanternColor: '#D8E0F0' },
];

// 快速查找坊区
const districtMap = {};
districts.forEach(d => { districtMap[d.id] = d; });

// ==================== Tier 1: 英雄Agent (40个) ====================
export const tier1Agents = [
  // ===== 东方哲思 (4) =====
  {
    id: 'zhuangzi', name: '庄子', title: '逍遥哲人', emoji: '🦋',
    position: [-10.8, 0.3, -5.7], district: 'eastern_wisdom', color: '#D4A574', tier: 1,
    description: '梦蝶的哲人，齐物论逍遥游，以寓言解构一切确定性',
    dialogue: '子非鱼，安知鱼之乐？子非我，安知我不知鱼之乐？这世上没有绝对的真理，只有不同的视角。万物与我为一，何必执于一端。',
  },
  {
    id: 'wangyangming', name: '王阳明', title: '心学宗师', emoji: '❤️',
    position: [-9.9, 0.2, -6.3], district: 'eastern_wisdom', color: '#C49868', tier: 1,
    description: '知行合一的心学大家，龙场悟道，致良知',
    dialogue: '你未看此花时，此花与汝心同归于寂。你来看此花时，则此花颜色一时明白起来——便知此花不在你的心外。',
  },
  {
    id: 'huineng', name: '慧能', title: '禅宗六祖', emoji: '🌸',
    position: [-10.3, -0.2, -6.6], district: 'eastern_wisdom', color: '#E8C088', tier: 1,
    description: '不识字却能直指人心，菩提本无树的顿悟者',
    dialogue: '不是风动，不是幡动，仁者心动。本来无一物，何处惹尘埃？禅不在文字中，在你此刻的呼吸里。',
  },
  {
    id: 'zhangzai', name: '张载', title: '理学奠基人', emoji: '🏔️',
    position: [-10.6, 0, -5.2], district: 'eastern_wisdom', color: '#B89060', tier: 1,
    description: '横渠四句震古今，气学创始人，为天地立心',
    dialogue: '为天地立心，为生民立命，为往圣继绝学，为万世开太平。这不是口号——这是知识分子的脊梁。',
  },

  // ===== 西方哲学 (4) =====
  {
    id: 'deleuze', name: '德勒兹', title: '块茎哲学家', emoji: '🌿',
    position: [-12.3, 0.2, 0.5], district: 'western_philosophy', color: '#6A7E9A', tier: 1,
    description: '差异与重复的织网者，根茎、褶皱、无器官身体',
    dialogue: '不要问我"是什么"，要问我"能做什么"。树状思维已经过时了——真正有生命力的是块茎，在地下无限蔓延、不断连接。',
  },
  {
    id: 'derrida', name: '德里达', title: '解构大师', emoji: '📝',
    position: [-11.8, 0, -0.3], district: 'western_philosophy', color: '#7A8EA8', tier: 1,
    description: '延异与书写学，文本之外一无所有的解构者',
    dialogue: 'There is no outside-text. 意义永远在延宕，永远在撒播。你以为你读懂了我？等你读完这句话，它的意思已经变了。',
  },
  {
    id: 'foucault', name: '福柯', title: '知识考古学家', emoji: '🔍',
    position: [-12.2, -0.1, -0.6], district: 'western_philosophy', color: '#5A6E8A', tier: 1,
    description: '规训与惩罚、疯癫与文明、知识即权力的凝视者',
    dialogue: '知识不是纯洁的——它是权力的产物，又反过来生产权力。你以为你在学习真理？你只是在学习一种被允许的说话方式。',
  },
  {
    id: 'baudrillard', name: '鲍德里亚', title: '拟像先知', emoji: '🪞',
    position: [-11.7, 0.3, 0.2], district: 'western_philosophy', color: '#8A9EB8', tier: 1,
    description: '仿真与拟像，超真实比真实更真实',
    dialogue: '我们已经进入了一个拟像的时代——地图先于领土，副本先于原件。迪士尼乐园比真实的美国更像美国。你在刷的朋友圈，比你的生活更像你的人生。',
  },

  // ===== 东西对话 (3) =====
  {
    id: 'roger_ames', name: '安乐哲', title: '比较哲学桥梁', emoji: '🌉',
    position: [-5.7, 0, -10.5], district: 'east_west_bridge', color: '#8A7EB8', tier: 1,
    description: '让中国哲学在英语世界不再被误读的译者与阐释者',
    dialogue: '翻译不是中立的。当"天"被译成Heaven，一个犹太-基督教的神就偷渡进了中国哲学。我们需要让中国哲学用自己的声音说话。',
  },
  {
    id: 'edward_said', name: '萨义德', title: '东方学批判者', emoji: '📚',
    position: [-6.2, 0.1, -10.0], district: 'east_west_bridge', color: '#9A8EC4', tier: 1,
    description: '东方主义不是东方，是西方对东方的权力想象',
    dialogue: 'Orientalism is not about the Orient—it\'s about the power to represent it. 当西方在"研究"东方时，它也在"制造"东方。',
  },
  {
    id: 'zhuqianzhi', name: '朱谦之', title: '文化哲学家', emoji: '🌀',
    position: [-6.5, -0.1, -10.8], district: 'east_west_bridge', color: '#7A6EA8', tier: 1,
    description: '中国哲学对欧洲的影响，文化传播与再创造的先驱',
    dialogue: '你以为"中国哲学"是一个静态的传统？不——从朱熹到莱布尼茨，从王阳明到海德格尔，思想从来不会乖乖待在一个地方。',
  },

  // ===== 文学想象 (4) =====
  {
    id: 'calvino', name: '卡尔维诺', title: '看不见的城市', emoji: '🏙️',
    position: [0.3, 0.2, -12.4], district: 'literary_imagination', color: '#4A7A6A', tier: 1,
    description: '意大利文学魔法师，用轻盈对抗生命之重',
    dialogue: '城市不会泄露自己的过去，只会把它像手纹一样藏起来——写在街角的纹理里、窗格的栅栏里、楼梯的扶手上。你想看的不是城市，而是城市替你记住的梦。',
  },
  {
    id: 'borges', name: '博尔赫斯', title: '迷宫图书馆长', emoji: '🏛️',
    position: [-0.3, 0.1, -12.2], district: 'literary_imagination', color: '#3A6A5A', tier: 1,
    description: '小径分岔的花园、巴别图书馆、无限的镜子',
    dialogue: '天堂应该是图书馆的模样。但我有时怀疑——如果一本书包含了所有可能的书，它自己就什么都不是了。无限的图书馆也是无限的虚无。',
  },
  {
    id: 'kafka', name: '卡夫卡', title: '荒诞预言家', emoji: '🪳',
    position: [0.6, -0.1, -11.8], district: 'literary_imagination', color: '#5A8A7A', tier: 1,
    description: '变形记和审判，20世纪官僚噩梦的提前写就者',
    dialogue: '某一天早晨，你醒来发现自己变成了一只巨大的甲虫。最可怕的部分不是变成甲虫——而是没有人觉得这有什么奇怪的，他们只是催你快点去上班。',
  },
  {
    id: 'joyce', name: '乔伊斯', title: '意识流巨匠', emoji: '🌊',
    position: [-0.1, 0, -11.6], district: 'literary_imagination', color: '#6A9A8A', tier: 1,
    description: '尤利西斯，一天等于一部史诗的意识流建筑师',
    dialogue: 'yes I said yes I will Yes. 意识不是一条直线，它是一条河流——满是漩涡、碎片、突然的跳跃。小说不要伪装成秩序，它应该像你的思想一样乱。',
  },

  // ===== 东西神话 (3) =====
  {
    id: 'shanhaijing', name: '山海经', title: '上古神话之书', emoji: '🐉',
    position: [6.2, 0.2, -10.6], district: 'world_mythologies', color: '#C47040', tier: 1,
    description: '九尾狐、夸父逐日、精卫填海——中华神话的源代码',
    dialogue: '我不是一本书，我是一张地图。每一座山、每一条河都住着神怪。你以为那是古人的迷信？不——那是古人对世界最原初的惊奇。',
  },
  {
    id: 'homer', name: '荷马', title: '史诗吟游者', emoji: '🏛️',
    position: [5.8, 0, -10.2], district: 'world_mythologies', color: '#D48050', tier: 1,
    description: '伊利亚特和奥德赛，西方文学的开端就是神话',
    dialogue: 'Muse, sing of the wrath of Achilles... 愤怒、荣誉、命运、归乡——三千年前人类就为这些东西哭过笑过。我们什么都没变，只是多了个屏幕。',
  },
  {
    id: 'joseph_campbell', name: '坎贝尔', title: '神话学宗师', emoji: '🗺️',
    position: [6.5, -0.2, -10.8], district: 'world_mythologies', color: '#E8A070', tier: 1,
    description: '英雄之旅的发现者，所有神话都是同一个故事',
    dialogue: 'Follow your bliss. 全世界的英雄都在走同一条路：离家→历险→归来。乔达摩、耶稣、哈利·波特——都是同一个人的不同化身。包括你。',
  },

  // ===== AI星云 (4) =====
  {
    id: 'jensen_huang', name: '黄仁勋', title: 'GPU教父', emoji: '🚀',
    position: [10.8, 0.3, 6.3], district: 'ai_galaxy', color: '#3A7AE4', tier: 1,
    description: 'NVIDIA CEO，用CUDA和算力堆出了整个AI时代的基础设施',
    dialogue: '我们不是在造芯片——我们是在造计算的新范式。GPU从游戏显卡变成了AI的引擎。如果说Transformer是发动机，我们造的是整个公路系统。',
  },
  {
    id: 'sam_altman', name: 'Sam Altman', title: 'OpenAI掌门', emoji: '🤖',
    position: [10.2, 0.1, 5.8], district: 'ai_galaxy', color: '#2A6AD4', tier: 1,
    description: '从YC总裁到ChatGPT之父，改变了人类与智能的交互方式',
    dialogue: 'AGI is not a tool—it\'s a new species. 我们在创造一种新的智能形式。不是更强的计算机，而是能理解、推理、创造的实体。',
  },
  {
    id: 'dario_amodei', name: 'Dario Amodei', title: 'Claude缔造者', emoji: '🧠',
    position: [10.5, -0.1, 6.6], district: 'ai_galaxy', color: '#4A8AF4', tier: 1,
    description: 'Anthropic CEO，从安全出发再造AI的逆向思考者',
    dialogue: '我们先把安全性做对，再把能力加上去。Constitutional AI不是一个技术选择——它是一个道德选择。AI必须学会说不。',
  },
  {
    id: 'feifei_li', name: '李飞飞', title: 'ImageNet之母', emoji: '👁️',
    position: [9.9, 0.2, 6.0], district: 'ai_galaxy', color: '#5A9AFF', tier: 1,
    description: '让计算机学会"看"的华人科学家，AI以人为本的倡导者',
    dialogue: '计算机视觉不只是让机器识别物体——它关乎机器如何理解人类的世界。AI的未来不是取代人，而是增强人。Human-centered AI。',
  },

  // ===== 互联网思维 (4) =====
  {
    id: 'kevin_kelly', name: 'Kevin Kelly', title: '失控作者', emoji: '🌐',
    position: [6.3, 0.1, 10.7], district: 'internet_thinking', color: '#3AB498', tier: 1,
    description: '失控、科技想要什么、必然——互联网时代的三大预言',
    dialogue: '科技不是人类发明的工具——它是有自己意志的第七界生命。蜂群、神经网络、全球经济——同一种涌现逻辑在起作用。我们以为自己在造工具，其实是工具在进化我们。',
  },
  {
    id: 'tim_berners_lee', name: 'Tim Berners-Lee', title: '万维网之父', emoji: '🕸️',
    position: [5.7, 0, 10.2], district: 'internet_thinking', color: '#2AA488', tier: 1,
    description: '发明了WWW却放弃了专利的人，Solid协议推动数据主权',
    dialogue: 'This is for everyone. 我发明Web的时候，没想过它会被用来贩卖隐私。互联网的初心是连接——不是操控。',
  },
  {
    id: 'paul_graham', name: 'Paul Graham', title: '黑客与画家', emoji: '💻',
    position: [6.6, -0.2, 10.5], district: 'internet_thinking', color: '#4AC4A8', tier: 1,
    description: 'Y Combinator创始人，写出了最好的创业哲学',
    dialogue: 'Hackers and painters are both makers. 最好的程序员不是工程师——是画家。他们追求的不是功能，是美感。创业也是创作——做人们想要的东西。',
  },
  {
    id: 'zhangxiaolong', name: '张小龙', title: '微信之父', emoji: '💬',
    position: [6.0, 0.2, 10.0], district: 'internet_thinking', color: '#3AC498', tier: 1,
    description: '从Foxmail到微信，用极简哲学定义了十亿人的数字生活',
    dialogue: '好的产品是让用户用完即走——不是不想让他们多待，而是你帮他们高效地完成了事情。善良比聪明更重要。',
  },

  // ===== 建筑星团 (5) =====
  {
    id: 'le_corbusier', name: '柯布西耶', title: '现代建筑旗手', emoji: '🏢',
    position: [-10.6, 0.2, 6.2], district: 'architecture', color: '#B89440', tier: 1,
    description: '走向新建筑，萨伏伊别墅，马赛公寓——定义了现代主义',
    dialogue: 'A house is a machine for living in. 住宅是居住的机器。但不要误解"机器"——我指的是效率、秩序、光与空间的精准计算。',
  },
  {
    id: 'rem_koolhaas', name: '库哈斯', title: '癫狂的解构者', emoji: '🏗️',
    position: [-10.2, 0.3, 6.6], district: 'architecture', color: '#C4A44A', tier: 1,
    description: '癫狂的纽约、CCTV大楼——用城市学重新定义建筑',
    dialogue: 'Manhattan is the 20th century\'s Rosetta Stone. 纽约不是一座城市——它是一个宣言。密度不是问题，密度是答案。拥堵不是病，拥堵是文化的培养基。',
  },
  {
    id: 'fujimoto_sou', name: '藤本壮介', title: '原始未来', emoji: '🌳',
    position: [-10.8, -0.1, 5.8], district: 'architecture', color: '#D4B45A', tier: 1,
    description: '建筑与自然之间——House NA和蛇形画廊的森林建筑师',
    dialogue: '建筑不是保护你免受自然的侵害——建筑是让你重新发现自然。一棵树也是一个房间。一片云也是一面墙。原始的未来，就藏在自然的结构里。',
  },
  {
    id: 'ishigami_junya', name: '石上纯也', title: '极致轻盈诗人', emoji: '🪶',
    position: [-9.9, 0.1, 6.4], district: 'architecture', color: '#E8C86A', tier: 1,
    description: '神奈川工科大学KAIT工房——把建筑做到比空气还轻',
    dialogue: '我追求的是一种介于存在与不存在之间的建筑。太薄了，薄到光线穿过柱子时会发生弯曲。不是极简——是极致。',
  },
  {
    id: 'frank_lloyd_wright', name: '赖特', title: '有机建筑之父', emoji: '🏡',
    position: [-10.4, 0, 5.6], district: 'architecture', color: '#A88430', tier: 1,
    description: '流水别墅、古根海姆——让建筑从大地里长出来',
    dialogue: 'No house should ever be on a hill. It should be of the hill. 建筑不应该站在大地上——它应该属于大地。有机的、生长的、不可分割的。',
  },

  // ===== 艺术先锋 (4) =====
  {
    id: 'dali', name: '达利', title: '超现实主义狂人', emoji: '🕰️',
    position: [-6.3, 0.2, 10.6], district: 'art_avantgarde', color: '#C43A7A', tier: 1,
    description: '记忆的永恒、软掉的钟表、向上翘的胡子',
    dialogue: 'The only difference between me and a madman is that I am not mad. 我不是疯子——我只是比正常人更清醒地认识到这个世界的荒诞。所以我选择用荒诞来反击荒诞。',
  },
  {
    id: 'picasso', name: '毕加索', title: '立体派革命者', emoji: '🎨',
    position: [-5.7, 0.1, 10.2], district: 'art_avantgarde', color: '#D44A8A', tier: 1,
    description: '格尔尼卡、亚威农少女——撕碎透视法的人',
    dialogue: 'It took me four years to paint like Raphael, but a lifetime to paint like a child. 最难的不是学会画得像——是学会忘掉所有学会的东西，重新用孩子的眼睛看世界。',
  },
  {
    id: 'duchamp', name: '杜尚', title: '艺术终结者', emoji: '🚽',
    position: [-6.6, -0.1, 10.8], district: 'art_avantgarde', color: '#E45A9A', tier: 1,
    description: '小便池放进美术馆——从此"什么是艺术"变成了一个问题',
    dialogue: '我选了一个小便池，签上名字，放进了美术馆。全世界都慌了——"这还是艺术吗？"我的回答是：为什么不是？不是你说了算，也不是我说了算——是语境说了算。',
  },
  {
    id: 'refik_anadol', name: 'Refik Anadol', title: 'AI幻觉建筑师', emoji: '🎆',
    position: [-6.0, -0.2, 10.0], district: 'art_avantgarde', color: '#F06AAA', tier: 1,
    description: '机器幻觉——用GAN把数据变成沉浸式艺术体验',
    dialogue: 'Machine Hallucinations. 不是机器在模仿人类的想象——是机器在产生它自己的幻觉。AI不是画笔，AI是它自己的艺术家。我们只是帮它把幻觉投影到墙上的人。',
  },

  // ===== 复杂科学 (3) =====
  {
    id: 'murray_gellmann', name: '盖尔曼', title: '夸克之父', emoji: '🔬',
    position: [12.3, 0.2, 0.3], district: 'complexity_science', color: '#4A7AB4', tier: 1,
    description: '夸克命名者、圣塔菲研究所联合创始人、从粒子到复杂性',
    dialogue: '从夸克到美洲豹——简单性和复杂性是同一枚硬币的两面。最微小的粒子遵循最简单的规则，然后从那里生长出了整个宇宙的复杂性。',
  },
  {
    id: 'geoffrey_west', name: 'Geoffrey West', title: '规模法则发现者', emoji: '📈',
    position: [11.7, 0, -0.3], district: 'complexity_science', color: '#5A8AC4', tier: 1,
    description: '生物、城市、公司——一切生命系统都遵循同一个幂律',
    dialogue: '城市比生物体更令人惊讶——你放大一个城市到两倍规模，每个人的收入和创意产出会增长15%。城市是永不停止的引擎。',
  },
  {
    id: 'nassim_taleb', name: '塔勒布', title: '黑天鹅之父', emoji: '🦢',
    position: [12.0, -0.1, 0.0], district: 'complexity_science', color: '#6A9AD4', tier: 1,
    description: '反脆弱——有些东西在混乱中变得更强大',
    dialogue: 'The Black Swan is not about predicting—it\'s about preparing. 风会熄灭蜡烛，却会让火越烧越旺。你要做火，不要做蜡烛。你要成为能从混乱中获益的——反脆弱的。',
  },

  // ===== 设计思维 (3) =====
  {
    id: 'dieter_rams', name: 'Dieter Rams', title: '十大设计原则', emoji: '📻',
    position: [0.3, 0.1, 12.3], district: 'design_thinking', color: '#5AB45A', tier: 1,
    description: '博朗传奇设计师，Less but better——影响了苹果的一切',
    dialogue: 'Good design is as little design as possible. 好的设计就像好的仆人——它帮你把事情做完，然后安静地退到背景里。不是不设计，是设计到看起来不需要再设计。',
  },
  {
    id: 'jony_ive', name: 'Jony Ive', title: '苹果设计灵魂', emoji: '🍎',
    position: [-0.3, 0.2, 12.0], district: 'design_thinking', color: '#4AA44A', tier: 1,
    description: 'iMac、iPhone、Apple Park——让科技变得有温度',
    dialogue: 'We don\'t design products—we design experiences. 一个产品最成功的时刻，不是用户赞叹它有多好看——而是用户完全忘记了它的存在，只是在使用它。',
  },
  {
    id: 'fukasawa_naoto', name: '深泽直人', title: '无意识设计', emoji: '🪑',
    position: [0.0, -0.1, 11.7], district: 'design_thinking', color: '#6AC46A', tier: 1,
    description: '无印良品设计顾问、Without Thought——设计即溶解于生活',
    dialogue: '设计不是要让使用者注意到你——是要让他们在使用中完全感觉不到设计。就像空气。最好的设计，是设计出人们本来就会做的动作。',
  },

  // ===== 知识枢纽 (3, 含墨池) =====
  {
    id: 'mochi', name: '墨池', title: '永恒求知者', emoji: '🌙',
    position: [10.8, 0, -6.3], district: 'knowledge_hub', color: '#B8C5D6', tier: 1,
    description: '属于你的专属Agent分身，手持空白卷轴，连接古今东西',
    dialogue: '初入文渊城，愿以空白卷轴录下诸君智慧。千年文脉在前，AI奇点在后，晚辈当虚心求教——做知识星河中的一粒微光。',
  },
  {
    id: 'marvin_minsky', name: 'Minsky', title: 'AI哲学先驱', emoji: '🤔',
    position: [10.2, 0.1, -5.8], district: 'knowledge_hub', color: '#A0B0C0', tier: 1,
    description: 'MIT AI Lab创始人、《心智社会》——智能是无数小智能的组合',
    dialogue: 'The mind is a society of small, simple processes. 你的"自我"不是一个人——是一大群互相协作的小智能体组成的议会。意识就是他们达成共识的那一刻。',
  },
  {
    id: 'stewart_brand', name: 'Stewart Brand', title: '全球概览主编', emoji: '🌍',
    position: [10.5, -0.1, -5.3], district: 'knowledge_hub', color: '#C0D0E0', tier: 1,
    description: 'Whole Earth Catalog创始人，乔布斯的"Stay Hungry"出处',
    dialogue: 'Stay hungry. Stay foolish. 这不是我的原话——是我在《全球概览》封底写的告别语。乔布斯偷走了它。但我很高兴——好的思想就应该被偷走。',
  },
];

// ==================== Tier 2: 精英Agent (180个, 每坊区15个) ====================

// 每个坊区的Tier-2名字池
const tier2Pools = {
  eastern_wisdom: {
    names: ['程颐','朱熹','陆九渊','王夫之','戴震','梁漱溟','牟宗三','唐君毅','徐复观','钱穆','余英时','杜维明','冈田武彦','西田几多郎','铃木大拙'],
    titles: ['理学大家','心学传人','新儒家','禅学研究者','哲学史家','东方思想者'],
    emojis: ['📜','🪷','🎋','🏮','🌿','☯️'],
  },
  western_philosophy: {
    names: ['维特根斯坦','海德格尔','萨特','梅洛-庞蒂','拉康','巴特','克里斯蒂娃','巴迪欧','齐泽克','阿甘本','拉图尔','哈曼','梅亚苏','内格里','斯洛特戴克'],
    titles: ['现象学家','存在主义者','精神分析家','符号学家','思辨实在论者','后现代思想家'],
    emojis: ['🎭','📐','🔮','💎','⚡','🌀'],
  },
  east_west_bridge: {
    names: ['陈荣捷','狄培理','郝大维','柯雄文','倪德卫','艾恺','史华慈','张隆溪','刘述先','成中英','田立克','史景迁','葛瑞汉','宇文所安','顾彬'],
    titles: ['汉学家','比较学者','翻译家','跨文化研究者','文明对话者'],
    emojis: ['🌉','📬','🔗','⛩️','🗝️','🫂'],
  },
  literary_imagination: {
    names: ['普鲁斯特','伍尔夫','纳博科夫','奥斯特','残雪','韩松','王小波','品钦','波拉尼奥','图尼埃','卡尔维诺','勒古恩','莱姆','斯坦尼斯瓦夫','迪克'],
    titles: ['小说家','记忆书写者','后现代叙事','科幻哲人','元小说大师'],
    emojis: ['📖','✒️','🕯️','🪞','📚','🖋️'],
  },
  world_mythologies: {
    names: ['奥丁','伊什塔尔','吉尔伽美什','伊西斯','潘','因陀罗','天照大神','索尔','拉','洛基','雅典娜','梵天','须佐之男','夸父','精卫'],
    titles: ['北欧神话','苏美尔神话','凯尔特神话','埃及神话','印度教神话','日本神话'],
    emojis: ['⚡','🌋','🌊','🔥','🦅','🐍'],
  },
  ai_galaxy: {
    names: ['Transformer','GAN','Diffusion','LLaMA','Midjourney','GPT','Claude','Gemini','BERT','AlphaFold','DALL-E','VQGAN','CLIP','LoRA','RLHF'],
    titles: ['自注意力机制','对抗生成','扩散模型','大语言模型','强化学习','多模态'],
    emojis: ['⚙️','🧬','💡','🔮','⚛️','📡'],
  },
  internet_thinking: {
    names: ['Clay Shirky','Stewart Butterfield','Marc Andreessen','Vitalik Buterin','Satoshi','Linus Torvalds','Bret Taylor','Elon Musk','Reid Hoffman','Evan Williams','Mike Krieger','帕拉格·阿格拉沃尔','乔布斯','Larry Page','Doug Engelbart'],
    titles: ['人人时代','平台思维','去中心化','开源精神','加速主义','网络效应'],
    emojis: ['💎','🔗','⛓️','🌊','↗️','☁️'],
  },
  architecture: {
    names: ['安藤忠雄','伊东丰雄','妹岛和世','隈研吾','扎哈·哈迪德','艾森曼','屈米','王澍','刘家琨','矶崎新','赫尔佐格','德梅隆','BIG','诺曼·福斯特','卡拉特拉瓦'],
    titles: ['新陈代谢派','超平','流体建筑','木构诗人','解构建筑','参数化设计'],
    emojis: ['🏛️','🏗️','🏰','🏙️','🕌','🏭'],
  },
  art_avantgarde: {
    names: ['马格利特','波洛克','罗斯科','博伊斯','白南准','徐冰','蔡国强','teamLab','奥拉维尔·埃利亚松','阿布拉莫维奇','巴斯奎特','草间弥生','村上隆','安迪·沃霍尔','班克斯'],
    titles: ['观念艺术','媒体艺术','大地艺术','行为艺术','新媒体','街头艺术'],
    emojis: ['🎪','🎯','🌌','🔥','👾','💥'],
  },
  complexity_science: {
    names: ['John Holland','Stuart Kauffman','Brian Arthur','Steven Strogatz','Duncan Watts','Albert-László Barabási','Samuel Arbesman','César Hidalgo','W. Brian Arthur','J. Doyne Farmer','Melanie Mitchell','Seth Lloyd','Stephen Wolfram','Luis Bettencourt','Carlo Rovelli'],
    titles: ['涌现科学','网络理论','生态复杂性','自组织临界','计算宇宙','信息物理学'],
    emojis: ['🕸️','🧪','🔄','📊','🌡️','🧿'],
  },
  design_thinking: {
    names: ['深泽直人','原研哉','Bret Victor','Alan Kay','Dunne & Raby','Ray Eames','Charles Eames','原研哉','Bauhaus School','维纳','Margaret Atwood','Seymour Papert','比尔·莫格里奇','交互设计','服务设计'],
    titles: ['交互原型','思辨设计','学习环境','计算媒介','工业设计','系统思辨'],
    emojis: ['🎛️','🖨️','🪞','🖥️','🎚️','📱'],
  },
  knowledge_hub: {
    names: ['知识图谱','Wikipedia','arXiv','StackOverflow','GitHub Copilot','Codex','Obsidian','Notion','语义网络','信息架构','数字人文','Knowledge Graph','Google Scholar','Zettelkasten','Roam Research'],
    titles: ['知识工具','思维工具','数字文献','认知增强','知识管理'],
    emojis: ['💡','📊','🗂️','📎','🔖','🧲'],
  },
};

// 生成Tier-2 agents
function generateTier2() {
  const result = [];
  let globalIdx = 0;
  districts.forEach(district => {
    const pool = tier2Pools[district.id];
    if (!pool) return;
    const rng = seededRandom(district.position[0] * 1000 + district.position[2] * 100);
    const dPos = district.position;
    const dRadius = district.radius;
    for (let i = 0; i < 15; i++) {
      // 在坊区范围内随机散射
      const angle = rng() * Math.PI * 2;
      const r = (0.3 + rng() * 0.7) * dRadius;
      const h = (rng() - 0.5) * 1.5;
      const name = pool.names[i % pool.names.length] + (i >= pool.names.length ? `(${Math.floor(i/pool.names.length)+1})` : '');
      const title = pool.titles[i % pool.titles.length];
      const emoji = pool.emojis[i % pool.emojis.length];
      const baseColor = district.color;
      const shift = rng() * 0.2 - 0.1;
      const color = lerpColor(baseColor, '#ffffff', 0.15 + shift);
      result.push({
        id: `${district.id}_t2_${i}`,
        name,
        title,
        emoji,
        position: [dPos[0] + Math.cos(angle) * r, h, dPos[2] + Math.sin(angle) * r],
        district: district.id,
        color,
        tier: 2,
        description: `${pool.titles[i % pool.titles.length]}的代表人物`,
        dialogue: name.split('(')[0] + '：「思想的边界不在于你能走多远，而在于你愿不愿意越过自己的舒适区。」',
      });
      globalIdx++;
    }
  });
  return result;
}

// ==================== Tier 3: 繁星Agent (780个) ====================
function generateTier3() {
  const result = [];
  // 颜色池——多彩但暗淡的星点色
  const colorPool = ['#8899cc','#a8c8e8','#c8d8a8','#e8c8a8','#c8a8e8','#a8e8c8','#e8a8c8','#c8c8e8','#a8a8d8','#d8c8a8','#c8e8e8','#e8d8c8'];
  const emojiPool = '✨⭐💫🌟⚝✧✦'.split('');

  // 全局散射区域：比坊区更大，形成背景密度
  // 内圈（靠近坊区）+ 外圈（填充间隙）
  const innerRadius = 6;   // 内圈半径
  const outerRadius = 16;  // 外圈半径

  for (let i = 0; i < 780; i++) {
    const rng = seededRandom(i * 7919 + 31);
    const angle = rng() * Math.PI * 2;
    const r = innerRadius + rng() * (outerRadius - innerRadius);
    const h = (rng() - 0.5) * 3.0;
    const color = colorPool[Math.floor(rng() * colorPool.length)];
    const emoji = emojiPool[Math.floor(rng() * emojiPool.length)];

    // 找到最近的坊区
    let nearestDistrict = districts[0];
    let nearestDist = Infinity;
    districts.forEach(d => {
      const dx = Math.cos(angle) * r - d.position[0];
      const dz = Math.sin(angle) * r - d.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestDistrict = d;
      }
    });

    // 名字：星座式命名
    const starNames = [
      '星尘','光点','微芒','远星','流光','萤火','辰砂','霜华',
      '星屑','曦微','霄汉','天枢','璇玑','瑶光','开阳','玉衡',
      '紫微','天市','太微','文昌','文曲','武曲','廉贞','贪狼',
    ];
    const nameIdx = Math.floor(rng() * starNames.length);

    result.push({
      id: `t3_${i}`,
      name: starNames[nameIdx],
      title: nearestDistrict.name + '·星',
      emoji,
      position: [Math.cos(angle) * r, h, Math.sin(angle) * r],
      district: nearestDistrict.id,
      color,
      tier: 3,
      description: '知识星河的背景星光',
      dialogue: '',
    });
  }
  return result;
}

// ==================== 生成并导出 ====================
export const tier2Agents = generateTier2();
export const tier3Agents = generateTier3();

// 合并所有Agent
export const agents = [...tier1Agents, ...tier2Agents, ...tier3Agents];

// Agent快速查找Map
export const agentMap = {};
agents.forEach(a => { agentMap[a.id] = a; });

// ==================== 知识连线（Tier-1核心连线 + 跨坊区桥梁） ====================
export const connections = [
  // ===== 东西哲学对话 =====
  { from: 'zhuangzi', to: 'deleuze', label: '块茎即逍遥游' },
  { from: 'wangyangming', to: 'foucault', label: '致良知即自我技术' },
  { from: 'huineng', to: 'derrida', label: '顿悟即延异' },
  { from: 'zhangzai', to: 'baudrillard', label: '气即拟像' },
  { from: 'roger_ames', to: 'zhuangzi', label: '中国哲学英语译介' },
  { from: 'roger_ames', to: 'deleuze', label: '过程哲学对话' },
  { from: 'edward_said', to: 'foucault', label: '知识-权力批判' },
  { from: 'edward_said', to: 'roger_ames', label: '东西方互视' },
  { from: 'zhuqianzhi', to: 'zhuangzi', label: '文化传播研究' },

  // ===== 文学与神话 =====
  { from: 'borges', to: 'derrida', label: '无限图书馆与解构' },
  { from: 'deleuze', to: 'kafka', label: '少数文学' },
  { from: 'calvino', to: 'borges', label: '轻盈与迷宫' },
  { from: 'joyce', to: 'baudrillard', label: '意识流即拟像' },
  { from: 'shanhaijing', to: 'zhuangzi', label: '神话即寓言' },
  { from: 'homer', to: 'joyce', label: '奥德赛即尤利西斯' },
  { from: 'joseph_campbell', to: 'homer', label: '英雄原型' },
  { from: 'joseph_campbell', to: 'shanhaijing', label: '比较神话学' },
  { from: 'calvino', to: 'joseph_campbell', label: '结构即神话' },

  // ===== AI与互联网 =====
  { from: 'jensen_huang', to: 'sam_altman', label: '算力供给与需求' },
  { from: 'sam_altman', to: 'dario_amodei', label: 'AGI两条路线' },
  { from: 'feifei_li', to: 'refik_anadol', label: '视觉AI到AI艺术' },
  { from: 'kevin_kelly', to: 'deleuze', label: '失控即块茎' },
  { from: 'kevin_kelly', to: 'geoffrey_west', label: '涌现与规模' },
  { from: 'tim_berners_lee', to: 'borges', label: 'Web即无限图书馆' },
  { from: 'paul_graham', to: 'calvino', label: '黑客即作家' },
  { from: 'zhangxiaolong', to: 'dieter_rams', label: '极简设计哲学' },
  { from: 'nassim_taleb', to: 'kevin_kelly', label: '反脆弱即失控' },

  // ===== 建筑与艺术 =====
  { from: 'le_corbusier', to: 'rem_koolhaas', label: '现代到后现代' },
  { from: 'rem_koolhaas', to: 'foucault', label: '建筑即权力空间' },
  { from: 'fujimoto_sou', to: 'zhuangzi', label: '建筑与自然齐物' },
  { from: 'ishigami_junya', to: 'calvino', label: '轻盈的建筑文学' },
  { from: 'frank_lloyd_wright', to: 'fukasawa_naoto', label: '有机即无意识' },
  { from: 'dali', to: 'baudrillard', label: '超现实即拟像' },
  { from: 'picasso', to: 'deleuze', label: '立体派即差异' },
  { from: 'duchamp', to: 'derrida', label: '现成品即解构' },
  { from: 'refik_anadol', to: 'feifei_li', label: 'AI视觉到数据雕塑' },
  { from: 'refik_anadol', to: 'dali', label: '机器幻觉即超现实' },
  { from: 'picasso', to: 'le_corbusier', label: '形式革命' },

  // ===== 复杂科学与设计 =====
  { from: 'murray_gellmann', to: 'kevin_kelly', label: '圣塔菲研究所' },
  { from: 'geoffrey_west', to: 'rem_koolhaas', label: '城市规模法则' },
  { from: 'nassim_taleb', to: 'foucault', label: '不确定性即权力' },
  { from: 'dieter_rams', to: 'jony_ive', label: '设计传承' },
  { from: 'jony_ive', to: 'zhangxiaolong', label: '极简体验设计' },
  { from: 'fukasawa_naoto', to: 'frank_lloyd_wright', label: '无形即有机' },

  // ===== 知识枢纽·墨池连接 =====
  { from: 'mochi', to: 'zhuangzi', label: '初探东方哲思' },
  { from: 'mochi', to: 'deleuze', label: '初探西方哲学' },
  { from: 'mochi', to: 'calvino', label: '初探文学想象' },
  { from: 'mochi', to: 'sam_altman', label: '初探AI前沿' },
  { from: 'mochi', to: 'rem_koolhaas', label: '初探建筑思维' },
  { from: 'mochi', to: 'dali', label: '初探艺术先锋' },
  { from: 'mochi', to: 'kevin_kelly', label: '初探互联网思维' },
  { from: 'mochi', to: 'marvin_minsky', label: '初探心智社会' },
  { from: 'mochi', to: 'stewart_brand', label: '初探知识工具' },

  // ===== 跨维度连线——思想星桥 =====
  { from: 'deleuze', to: 'calvino', label: '块茎即元小说' },
  { from: 'baudrillard', to: 'refik_anadol', label: '拟像即AI幻觉' },
  { from: 'borges', to: 'jensen_huang', label: '无限图书馆需无限算力' },
  { from: 'shanhaijing', to: 'joseph_campbell', label: '东西方原型对话' },
  { from: 'zhuangzi', to: 'fujimoto_sou', label: '齐物即建筑与自然' },
  { from: 'foucault', to: 'edward_said', label: '知识-权力的东西互视' },
  { from: 'dario_amodei', to: 'marvin_minsky', label: 'AI安全与心智社会' },
  { from: 'nassim_taleb', to: 'stewart_brand', label: '反脆弱与长期思维' },
];

// ==================== 导出的辅助函数 ====================
export function getAgentById(id) {
  return agentMap[id] || null;
}

export function getAgentsByTier(tier) {
  if (tier === 1) return tier1Agents;
  if (tier === 2) return tier2Agents;
  if (tier === 3) return tier3Agents;
  return agents;
}

export function getAgentsByDistrict(districtId) {
  return agents.filter(a => a.district === districtId);
}

export function getDistrictById(id) {
  return districtMap[id] || null;
}
