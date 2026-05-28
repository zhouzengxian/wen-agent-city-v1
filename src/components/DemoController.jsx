import { useEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import useCityStore from '../store/useCityStore';
import { demoScript, particleConverge } from '../data/demoScript';
import { agents } from '../data/gameData';
import { orbitControlsRef } from './CityScene';
import {
  initAudio, startAmbient, stopAmbient,
  playTypeSound, playDing, playBell, playWhoosh, playConvergeWhoosh
} from '../utils/audio';

// 快速查找Agent初始位置
function getAgentPos(id) {
  const a = agents.find(x => x.id === id);
  return a ? [a.position[0], a.position[1] || 0, a.position[2]] : [0, 0, 0];
}

// ===== Demo 中高亮当前说话的 Agent =====
export function DemoHighlightGlow({ getPos }) {
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const highlightId = useCityStore((s) => s.demoHighlightAgent);
  const glowRef = useRef();
  const ringRef = useRef();

  useFrame((state) => {
    const active = demoPlaying && highlightId;
    if (!glowRef.current) return;
    if (active && getPos) {
      const [px, py, pz] = getPos(highlightId);
      glowRef.current.position.set(px, py, pz);
      ringRef.current && ringRef.current.position.set(px, py, pz);
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      glowRef.current.scale.setScalar(pulse);
      glowRef.current.material.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ringRef.current && (ringRef.current.material.opacity =
        0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.15);
    } else {
      glowRef.current.material.opacity = 0;
      ringRef.current && (ringRef.current.material.opacity = 0);
    }
  });

  if (!demoPlaying) return null;

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffcc44" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.75, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} side={2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ===== 苍穹俯瞰：粒子聚合 =====
export function DemoConvergeParticles() {
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const demoPhase = useCityStore((s) => s.demoPhase);
  const demoProgress = useCityStore((s) => s.demoProgress);
  const pointsRef = useRef();
  const phaseRef = useRef(0);

  const { positions, colors } = useMemo(() => {
    const count = particleConverge.particleCount;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = ['#c9a96e', '#8ab4f8', '#f8c8dc', '#a8d8ea', '#ffeeb8', '#d4a6ff', '#c8ffa8', '#ffa8c8'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = particleConverge.startRadius * (0.3 + Math.random() * 0.7);
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.3) * particleConverge.height;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      const pc = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      col[i * 3] = pc.r; col[i * 3 + 1] = pc.g; col[i * 3 + 2] = pc.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const isAerial = demoPlaying && demoPhase === 'aerial';
    const progress = isAerial ? Math.min(demoProgress / 0.09, 1) : 0;

    phaseRef.current += delta * 0.4;
    const arr = pointsRef.current.geometry.attributes.position.array;
    const count = particleConverge.particleCount;
    const targetRadius = THREE.MathUtils.lerp(particleConverge.startRadius, particleConverge.endRadius, progress);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + phaseRef.current + Math.sin(i * 0.07) * 0.5;
      const origR = Math.sqrt(arr[i * 3] ** 2 + arr[i * 3 + 2] ** 2) || particleConverge.startRadius * 0.5;
      const r = origR + (targetRadius - particleConverge.startRadius) * (origR / particleConverge.startRadius);
      arr[i * 3] = Math.cos(angle) * Math.max(r, 0.5);
      arr[i * 3 + 2] = Math.sin(angle) * Math.max(r, 0.5);
      arr[i * 3 + 1] += (-1.5 - arr[i * 3 + 1]) * delta * progress * 2;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.material.opacity = 0.75 - progress * 0.5;
  });

  if (!demoPlaying || demoPhase !== 'aerial') return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleConverge.particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleConverge.particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ===== 粒子尾迹（跨坊区飞线） =====
export function ButterflyTrail() {
  const demoButterflyPos = useCityStore((s) => s.demoButterflyPos);
  const trailRef = useRef();
  const trailPts = useRef([]);
  const maxTrail = 60;

  useFrame(() => {
    if (!demoButterflyPos || !trailRef.current) return;
    trailPts.current.push(new THREE.Vector3(demoButterflyPos[0], demoButterflyPos[1], demoButterflyPos[2]));
    if (trailPts.current.length > maxTrail) trailPts.current.shift();
    const arr = trailRef.current.geometry.attributes.position.array;
    for (let i = 0; i < maxTrail; i++) {
      if (i < trailPts.current.length) {
        const pt = trailPts.current[i];
        arr[i * 3] = pt.x; arr[i * 3 + 1] = pt.y; arr[i * 3 + 2] = pt.z;
      } else {
        arr[i * 3] = 0; arr[i * 3 + 1] = -999; arr[i * 3 + 2] = 0;
      }
    }
    trailRef.current.geometry.attributes.position.needsUpdate = true;
    trailRef.current.geometry.setDrawRange(0, Math.min(trailPts.current.length, maxTrail));
  });

  if (!demoButterflyPos) return null;
  const positions = new Float32Array(maxTrail * 3);
  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={maxTrail} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#c9a96e" transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ===== 人脉溯源 =====
export function TraceHighlights({ connections, agents }) {
  const traceActive = useCityStore((s) => s.traceActive);
  const traceIndex = useCityStore((s) => s.traceIndex);
  if (!traceActive) return null;

  const agentMap = {};
  agents.forEach((a) => { agentMap[a.id] = a; });

  const tracePath = [
    { from: 'zhuangzi', to: 'deleuze', label: '块茎即逍遥游' },
    { from: 'deleuze', to: 'kevin_kelly', label: '块茎即失控' },
    { from: 'kevin_kelly', to: 'jensen_huang', label: '涌现需要算力' },
    { from: 'jensen_huang', to: 'refik_anadol', label: 'GPU的幻觉' },
    { from: 'refik_anadol', to: 'dali', label: '机器即超现实' },
    { from: 'baudrillard', to: 'rem_koolhaas', label: '建筑即拟像' },
    { from: 'rem_koolhaas', to: 'fujimoto_sou', label: '从拟像到自然' },
    { from: 'fujimoto_sou', to: 'zhuangzi', label: '回归天地大美' },
  ];

  return (
    <group>
      {tracePath.map((tp, i) => {
        const fromA = agentMap[tp.from];
        const toA = agentMap[tp.to];
        if (!fromA || !toA) return null;
        const active = i <= traceIndex;
        const points = [
          new THREE.Vector3(fromA.position[0], 0.3, fromA.position[2]),
          new THREE.Vector3((fromA.position[0] + toA.position[0]) / 2, 0.8, (fromA.position[2] + toA.position[2]) / 2),
          new THREE.Vector3(toA.position[0], 0.3, toA.position[2]),
        ];
        return <TraceLine key={i} points={points} color={fromA.color} active={active} index={i} />;
      })}
    </group>
  );
}

function TraceLine({ points, color, active, index }) {
  const lineRef = useRef();
  const glowRef = useRef();
  const lastActive = useRef(false);

  useFrame(() => {
    if (!lineRef.current) return;
    const target = active ? 0.7 : 0;
    lineRef.current.material.opacity += (target - lineRef.current.material.opacity) * 0.12;
    if (glowRef.current) glowRef.current.material.opacity = lineRef.current.material.opacity * 0.4;
    if (active && !lastActive.current) setTimeout(() => playDing(), index * 100 + 200);
    lastActive.current = active;
  });

  return (
    <group>
      <mesh ref={lineRef}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 64, 0.025, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 32, 0.06, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ===== 新人入驻 =====
export function WelcomeResident() {
  const residentActive = useCityStore((s) => s.residentActive);
  const residentProgress = useCityStore((s) => s.residentProgress);
  const houseRef = useRef();
  const mochiRef = useRef();
  const bellPlayed = useRef(false);

  useFrame(() => {
    if (!residentActive) return;
    if (mochiRef.current) {
      const t = residentProgress;
      mochiRef.current.position.set(10.8 + (0 - 10.8) * t, t * 0.3, -6.3 + (6.3 - 6.3) * t);
    }
    if (houseRef.current) {
      houseRef.current.position.y = -3 + residentProgress * 3;
      houseRef.current.scale.setScalar(0.01 + residentProgress * 0.99);
      houseRef.current.visible = residentProgress > 0.05;
    }
    if (!bellPlayed.current && residentProgress > 0.5) { bellPlayed.current = true; playBell(); }
  });

  return (
    <group>
      {residentActive && (
        <group ref={mochiRef} position={[10.8, 0, -6.3]}>
          <mesh><cylinderGeometry args={[0.15, 0.2, 0.35, 6]} /><meshStandardMaterial color="#B8C5D6" emissive="#B8C5D6" emissiveIntensity={0.4} /></mesh>
          <mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#B8C5D6" emissive="#B8C5D6" emissiveIntensity={0.6} /></mesh>
          <pointLight position={[0, 0, 0]} color="#B8C5D6" intensity={0.5} distance={3} />
        </group>
      )}
      <group ref={houseRef} visible={false} position={[0, -3, 0.5]}>
        <mesh position={[0, -0.1, 0]}><cylinderGeometry args={[0.4, 0.45, 0.15, 8]} /><meshStandardMaterial color="#3a3a2a" /></mesh>
        <mesh position={[0, 0.25, 0]}><boxGeometry args={[0.6, 0.5, 0.6]} /><meshStandardMaterial color="#4a3a2a" /></mesh>
        <mesh position={[0, 0.6, 0]}><coneGeometry args={[0.5, 0.3, 4]} /><meshStandardMaterial color="#5a4a3a" /></mesh>
        <mesh position={[0, 0.75, 0]}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#B8C5D6" emissive="#B8C5D6" emissiveIntensity={1} /></mesh>
      </group>
    </group>
  );
}

// ===== 主控制器：六度知识对话 =====
export default function DemoController() {
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const setDemoPhase = useCityStore((s) => s.setDemoPhase);
  const setDemoProgress = useCityStore((s) => s.setDemoProgress);
  const setDemoDialogue = useCityStore((s) => s.setDemoDialogue);
  const setDemoHighlightAgent = useCityStore((s) => s.setDemoHighlightAgent);
  const setDemoButterflyPos = useCityStore((s) => s.setDemoButterflyPos);
  const setTraceActive = useCityStore((s) => s.setTraceActive);
  const advanceTrace = useCityStore((s) => s.advanceTrace);
  const setResidentActive = useCityStore((s) => s.setResidentActive);
  const setResidentProgress = useCityStore((s) => s.setResidentProgress);
  const endDemo = useCityStore((s) => s.endDemo);
  const setAutoRotate = useCityStore((s) => s.setAutoRotate);

  const { camera } = useThree();
  const tlRef = useRef(null);

  useEffect(() => {
    if (!demoPlaying) {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      stopAmbient();
      return;
    }

    initAudio();
    startAmbient();

    const total = demoScript.totalDuration;
    const tl = gsap.timeline({
      onUpdate: () => setDemoProgress(tl.time() / total),
      onComplete: () => {
        endDemo();
        setAutoRotate(true);
        stopAmbient();
      },
    });
    tlRef.current = tl;

    // ==== 核心：镜头飞到Agent斜上方 + 对准Agent ====
    // demo 期间 OrbitControls enabled=false，直接用 camera.lookAt() 控制朝向
    // 同时更新 controls.target 以保持状态同步（demo 结束后 OrbitControls 从当前状态恢复）
    const _lookTarget = new THREE.Vector3();
    function flyToAgent(agentId, time, duration = 2.5) {
      const [tx, ty, tz] = getAgentPos(agentId);
      const controls = orbitControlsRef.current;
      if (!controls) return;

      const proxy = {
        px: camera.position.x, py: camera.position.y, pz: camera.position.z,
        tx: controls.target.x, ty: controls.target.y, tz: controls.target.z,
      };

      tl.to(proxy, {
        px: tx + 4, py: ty + 3.5, pz: tz + 5,
        tx: tx, ty: ty, tz: tz,
        duration, ease: 'power2.inOut',
        onUpdate: () => {
          camera.position.set(proxy.px, proxy.py, proxy.pz);
          controls.target.set(proxy.tx, proxy.ty, proxy.tz);
          _lookTarget.set(proxy.tx, proxy.ty, proxy.tz);
          camera.lookAt(_lookTarget);
        },
      }, time);
    }

    // ==== 0-5s: 苍穹俯瞰 ====
    setDemoPhase('aerial');
    setDemoHighlightAgent(null);
    tl.set(camera.position, { x: 0, y: 28, z: 18 }, 0);
    tl.call(() => playConvergeWhoosh(), null, 0);
    tl.to(camera.position, { x: 0, y: 12, z: 16, duration: 5, ease: 'power2.inOut' }, 0);

    // ==== 5-9s: 城邦降临（镜头拉远一览全局） ====
    tl.call(() => { setDemoPhase('descent'); playWhoosh(); setDemoHighlightAgent(null); }, null, 5);
    tl.to(camera.position, { x: 0, y: 7, z: 14, duration: 4, ease: 'power1.inOut' }, 5);

    // ==== 9-18s: 第一度 东西哲学（庄子 ↔ 德勒兹） ====
    tl.call(() => { setDemoPhase('philosophy'); playWhoosh(); }, null, 9);
    flyToAgent('zhuangzi', 9, 2.5);

    const d1 = demoScript.scenes.find(s => s.id === 'philosophy');
    d1?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 9 + d.time, 1.5);
      }, null, 9 + d.time);
    });

    // ==== 18-26s: 第二度 互联网思维（德勒兹 → Kevin Kelly） ====
    tl.call(() => { setDemoPhase('web_rhizome'); playWhoosh(); }, null, 18);
    flyToAgent('deleuze', 18, 2.5);

    const d2 = demoScript.scenes.find(s => s.id === 'web_rhizome');
    d2?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 18 + d.time, 1.5);
      }, null, 18 + d.time);
    });

    // ==== 26-36s: 第三度 AI星云（Kelly → 黄仁勋 → Sam Altman） ====
    tl.call(() => { setDemoPhase('ai_emergence'); playWhoosh(); }, null, 26);
    flyToAgent('kevin_kelly', 26, 2.5);

    const d3 = demoScript.scenes.find(s => s.id === 'ai_emergence');
    d3?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 26 + d.time, 1.5);
      }, null, 26 + d.time);
    });

    // ==== 36-44s: 第四度 艺术先锋（黄仁勋 → Refik Anadol） ====
    tl.call(() => { setDemoPhase('art_hallucination'); playWhoosh(); }, null, 36);
    flyToAgent('jensen_huang', 36, 2.5);

    const d4 = demoScript.scenes.find(s => s.id === 'art_hallucination');
    d4?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 36 + d.time, 1.5);
      }, null, 36 + d.time);
    });

    // ==== 44-54s: 第五度 艺术再质问（Dali → 杜尚 → 鲍德里亚） ====
    tl.call(() => { setDemoPhase('philosophy_art'); playWhoosh(); }, null, 44);
    flyToAgent('dali', 44, 2);

    const d5 = demoScript.scenes.find(s => s.id === 'philosophy_art');
    d5?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 44 + d.time, 1.5);
      }, null, 44 + d.time);
    });

    // ==== 54-64s: 第六度 建筑即哲学（鲍德里亚 → 库哈斯 → 藤本壮介） ====
    tl.call(() => { setDemoPhase('architecture_dream'); playWhoosh(); }, null, 54);
    flyToAgent('baudrillard', 54, 2);

    const d6 = demoScript.scenes.find(s => s.id === 'architecture_dream');
    d6?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 54 + d.time, 1.5);
      }, null, 54 + d.time);
    });

    // ==== 64-72s: 回到东方·收束 ====
    tl.call(() => { setDemoPhase('east_root'); setTraceActive(true); advanceTrace(); }, null, 64);
    // 人脉逐步显现
    [65, 65.5, 66, 66.5, 67, 67.5, 68, 68.5].forEach((t, i) => {
      tl.call(() => { if (i > 0) advanceTrace(); }, null, t);
    });

    const d7 = demoScript.scenes.find(s => s.id === 'east_root');
    d7?.dialogues.forEach(d => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        setDemoHighlightAgent(d.speaker);
        flyToAgent(d.speaker, 64 + d.time, 1.5);
      }, null, 64 + d.time);
    });

    // 新人入驻
    tl.call(() => {
      setDemoPhase('welcome');
      setTraceActive(false);
      setResidentActive(true);
      setDemoHighlightAgent('mochi');
    }, null, 72);

    const residentObj = { v: 0 };
    tl.to(residentObj, {
      v: 1, duration: 2, ease: 'back.out(1.7)',
      onUpdate: () => setResidentProgress(residentObj.v),
    }, 72);

    // 最后拉起全景
    tl.to(camera.position, { x: 0, y: 12, z: 18, duration: 2.5, ease: 'power2.out' }, 73);
    // target 也回到中心
    const controlsEnd = orbitControlsRef.current;
    if (controlsEnd) {
      const tpEnd = { x: controlsEnd.target.x, y: controlsEnd.target.y, z: controlsEnd.target.z };
      tl.to(tpEnd, {
        x: 0, y: 0, z: 0, duration: 2,
        onUpdate: () => controlsEnd.target.set(tpEnd.x, tpEnd.y, tpEnd.z),
      }, 73);
    }
    tl.call(() => { setDemoHighlightAgent(null); setTraceActive(false); }, null, 75);

    return () => {};
  }, [demoPlaying]);

  return null;
}
