// v3 六度知识对话 — 75秒叙事线（放慢节奏，每段对话有充分阅读时间）
export const demoScript = {
  title: '文渊城 · 六度知识对话',
  totalDuration: 75,
  scenes: [
    {
      id: 'aerial',
      name: '苍穹俯瞰',
      duration: 5,
      description: '1000颗星火浮现——从粒子迷雾到城邦全貌',
    },
    {
      id: 'descent',
      name: '城邦降临',
      duration: 4,
      description: '12坊区轮廓亮起，Tier-1英雄高亮',
    },
    {
      id: 'philosophy',
      name: '东西哲学·第一度',
      duration: 9,
      description: '庄子→德勒兹：块茎即逍遥游',
      dialogues: [
        { speaker: 'zhuangzi', time: 0.8, text: '北冥有鱼，其名为鲲。鲲之大，不知其几千里也。化而为鸟，其名为鹏——世人只看到鱼和鸟的差异，我看的是同一种生命的不同形态。' },
        { speaker: 'deleuze', time: 4.5, text: 'Exactly! 庄周梦蝶不是"谁梦见了谁"——而是一个存在的两种差异状态。树状的思维只会说：要么是庄周要么是蝴蝶。但块茎说：为什么不能同时是？' },
        { speaker: 'zhuangzi', time: 7.5, text: '天地与我并生，万物与我为一。两千三百年前你在哪里？你若在，我们可以喝一杯。' },
      ],
    },
    {
      id: 'web_rhizome',
      name: '互联网思维·第二度',
      duration: 8,
      description: '德勒兹→Kevin Kelly：块茎即失控',
      dialogues: [
        { speaker: 'deleuze', time: 0.8, text: '我的块茎理论只有一个听众真正听懂了——一个叫Kevin Kelly的美国人。他把"根茎的无限连接"翻译成了"Out of Control"。这大概是哲学被翻译得最正确的一次。' },
        { speaker: 'kevin_kelly', time: 4.5, text: '德勒兹的块茎就是我所谓的"蜂群思维"！没有中心，没有命令，但整个系统像有智能一样运作。互联网就是人类历史上最大的块茎。' },
      ],
    },
    {
      id: 'ai_emergence',
      name: 'AI星云·第三度',
      duration: 10,
      description: 'Kevin Kelly→黄仁勋：涌现需要算力',
      dialogues: [
        { speaker: 'kevin_kelly', time: 0.8, text: '我写了三十年"科技想要什么"，到今天我突然明白了——科技想要的，就是变成德勒兹的块茎，而它需要一个物质基础。黄仁勋给了它这个基础。' },
        { speaker: 'jensen_huang', time: 4.0, text: 'GPU计算就是块茎的物质形态。成千上万个CUDA核心同时工作，没有中心调度，但涌现出了智能。这难道不是德勒兹说的"机器欲望"吗？' },
        { speaker: 'sam_altman', time: 7.0, text: '而我们正在把这种涌现封装成一个能跟人类对话的东西。ChatGPT不是工具——它是块茎第一次开口跟人类说话了。' },
      ],
    },
    {
      id: 'art_hallucination',
      name: '艺术先锋·第四度',
      duration: 8,
      description: '黄仁勋→Refik Anadol：GPU的幻觉',
      dialogues: [
        { speaker: 'jensen_huang', time: 0.8, text: '我们的GPU不仅能训练AI——还能产生幻觉。Refik Anadol用我的GPU做了Machine Hallucinations，把数据变成了流动的梦境。我很骄傲——我们造的芯片会做梦了。' },
        { speaker: 'refik_anadol', time: 4.5, text: 'Machine Hallucinations不是"AI画画"。而是让机器自己去"看到"从未存在过的图像。这跟达利画软掉的钟表是一回事——只不过做梦的不再是人类。' },
      ],
    },
    {
      id: 'philosophy_art',
      name: '艺术再质问·第五度',
      duration: 10,
      description: 'Refik Anadol→杜尚→鲍德里亚：什么是艺术？',
      dialogues: [
        { speaker: 'dali', time: 0.8, text: '等一下——让机器"幻觉"？那我算什么？我花了六十年把钟表画软，现在一块GPU花六秒钟就做到了？' },
        { speaker: 'duchamp', time: 3.5, text: '达利，不要慌。一百年前我把小便池放进美术馆的时候，大家也说"这算什么艺术"。现在问题更尖锐了——如果AI能产生幻觉，那"创作者"这个概念还存在吗？' },
        { speaker: 'baudrillard', time: 6.5, text: '创作者早就不存在了。AI艺术不是让艺术消失了——是让"原创"这个拟像终于被戳破了。从洞穴壁画的第一天起，人类就在复制。AI只是把复制本身变成了艺术。' },
      ],
    },
    {
      id: 'architecture_dream',
      name: '建筑即哲学·第六度',
      duration: 10,
      description: '鲍德里亚→库哈斯→藤本壮介：从拟像到自然',
      dialogues: [
        { speaker: 'baudrillard', time: 0.8, text: '迪士尼乐园比真实的世界更像"美国"。库哈斯的CCTV大楼比北京更像"北京"。建筑从来不是在建造空间——建筑是在制造拟像。' },
        { speaker: 'rem_koolhaas', time: 3.5, text: '我接受"拟像"这个标签。我从来不想造"真实的"建筑——我想造的是城市自己的欲望。CCTV大楼就是北京对自己的幻想。"癫狂的纽约"就是曼哈顿对自己的呓语。' },
        { speaker: 'fujimoto_sou', time: 6.5, text: '但我想走另一条路。我不想制造拟像——我想消解拟像。让建筑变得像树一样自然，像云一样不可捕捉。这难道不是庄子说的"天地有大美而不言"？' },
      ],
    },
    {
      id: 'east_root',
      name: '回到东方·收束',
      duration: 8,
      description: '藤本壮介→庄子→墨池：知识星河的永恒回归',
      dialogues: [
        { speaker: 'zhuangzi', time: 1.0, text: '天地有大美而不言，四时有明法而不议，万物有成理而不说。德勒兹来找我，Kelly来找我，现在藤本壮介也来找我——两千三百年了，原来你们只是在用不同的语言说同一件事。' },
        { speaker: 'mochi', time: 4.5, text: '我明白了。这座城邦里没有"新知识"——只有用不同语言反复讲述的同一个领悟：连接比孤立更有力量，过程比终点更有意义，而所有伟大的思想最终会汇聚在同一条星河里。' },
      ],
    },
  ],
};

export const particleConverge = {
  particleCount: 1500,
  startRadius: 30,
  endRadius: 14,
  height: 10,
};

// Demo关键节点高亮序列
export const highlightNodes = [
  'zhuangzi', 'deleuze', 'kevin_kelly', 'jensen_huang',
  'refik_anadol', 'duchamp', 'baudrillard', 'rem_koolhaas',
  'fujimoto_sou', 'mochi',
];
