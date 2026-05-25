import { useEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import useCityStore from '../store/useCityStore';
import { demoScript, particleConverge } from '../data/demoScript';
import {
  initAudio, startAmbient, stopAmbient,
  playTypeSound, playDing, playBell, playWhoosh, playConvergeWhoosh
} from '../utils/audio';

// ===== 苍穹俯瞰：粒子聚合 =====
export function DemoConvergeParticles() {
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const demoPhase = useCityStore((s) => s.demoPhase);
  const demoProgress = useCityStore((s) => s.demoProgress);
  const pointsRef = useRef();
  const phaseRef = useRef(0);

  const { positions } = useMemo(() => {
    const count = particleConverge.particleCount;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = particleConverge.startRadius * (0.3 + Math.random() * 0.7);
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.3) * particleConverge.height;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return { positions: pos };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const isAerial = demoPlaying && demoPhase === 'aerial';
    const progress = isAerial ? Math.min(demoProgress / 0.11, 1) : 0;

    phaseRef.current += delta * 0.5;
    const arr = pointsRef.current.geometry.attributes.position.array;
    const count = particleConverge.particleCount;
    const targetRadius = THREE.MathUtils.lerp(
      particleConverge.startRadius, particleConverge.endRadius, progress
    );

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + phaseRef.current + Math.sin(i * 0.1) * 0.5;
      const origR = Math.sqrt(arr[i * 3] ** 2 + arr[i * 3 + 2] ** 2) || particleConverge.startRadius * 0.5;
      const r = origR + (targetRadius - particleConverge.startRadius) * (origR / particleConverge.startRadius);
      arr[i * 3] = Math.cos(angle) * Math.max(r, 0.5);
      arr[i * 3 + 2] = Math.sin(angle) * Math.max(r, 0.5);
      arr[i * 3 + 1] += (-1.5 - arr[i * 3 + 1]) * delta * progress * 2;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.material.opacity = 0.8 - progress * 0.5;
  });

  if (!demoPlaying || demoPhase !== 'aerial') return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleConverge.particleCount}
          array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#c9a96e" transparent opacity={0.7}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ===== 蝶纹尾迹 =====
export function ButterflyTrail() {
  const demoButterflyPos = useCityStore((s) => s.demoButterflyPos);
  const trailRef = useRef();
  const trailPts = useRef([]);
  const maxTrail = 50;

  useFrame(() => {
    if (!demoButterflyPos || !trailRef.current) return;
    trailPts.current.push(new THREE.Vector3(demoButterflyPos[0], demoButterflyPos[1] - 0.1, demoButterflyPos[2]));
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
      <pointsMaterial size={0.05} color="#c77db5" transparent opacity={0.6}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ===== 人脉溯源：连线高亮 =====
export function TraceHighlights({ connections, agents }) {
  const traceActive = useCityStore((s) => s.traceActive);
  const traceIndex = useCityStore((s) => s.traceIndex);
  const tracePath = demoScript.scenes.find((s) => s.id === 'trace')?.tracePath || [];

  if (!traceActive) return null;

  const agentMap = {};
  agents.forEach((a) => { agentMap[a.id] = a; });

  return (
    <group>
      {tracePath.map((tp, i) => {
        const fromA = agentMap[tp.from];
        const toA = agentMap[tp.to];
        if (!fromA || !toA) return null;

        const active = i <= traceIndex;
        const points = [
          new THREE.Vector3(fromA.position[0], 0.3, fromA.position[2]),
          new THREE.Vector3(
            (fromA.position[0] + toA.position[0]) / 2, 0.8,
            (fromA.position[2] + toA.position[2]) / 2 + (fromA.position[0] - toA.position[0]) * 0.3,
          ),
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
    const target = active ? 0.8 : 0;
    lineRef.current.material.opacity += (target - lineRef.current.material.opacity) * 0.15;
    if (glowRef.current) {
      glowRef.current.material.opacity = lineRef.current.material.opacity * 0.5;
    }
    // 刚亮起时播叮声
    if (active && !lastActive.current) {
      setTimeout(() => playDing(), index * 100 + 200);
    }
    lastActive.current = active;
  });

  return (
    <group>
      <mesh ref={lineRef}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 64, 0.03, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef}>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 32, 0.08, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>
      {active && (
        <>
          <mesh position={points[0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
          <mesh position={points[2]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}

// ===== 新人入驻：墨池+新房 =====
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
      mochiRef.current.position.set(
        1 + (0 - 1) * t,
        0 + t * 0.3,
        -4 + (-4 + 4) * t,
      );
    }

    if (houseRef.current) {
      houseRef.current.position.y = -2 + residentProgress * 2;
      houseRef.current.scale.setScalar(0.01 + residentProgress * 0.99);
      houseRef.current.visible = residentProgress > 0.05;
    }

    // 钟声 - 新房升起过半时播
    if (!bellPlayed.current && residentProgress > 0.5) {
      bellPlayed.current = true;
      playBell();
    }
  });

  return (
    <group>
      {residentActive && (
        <group ref={mochiRef} position={[1, 0, -4]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.25, 0.4, 6]} />
            <meshStandardMaterial color="#B8C5D6" emissive="#B8C5D6" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#B8C5D6" emissive="#B8C5D6" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[0, 0, 0]} color="#B8C5D6" intensity={0.5} distance={3} />
        </group>
      )}

      <group ref={houseRef} visible={false} position={[0, -2, 0.5]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.55, 0.2, 8]} />
          <meshStandardMaterial color="#3a3a2a" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshStandardMaterial color="#4a3a2a" />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[0.55, 0.35, 4]} />
          <meshStandardMaterial color="#5a4a3a" />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#B8C5D6" emissive="#B8C5D6" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshBasicMaterial color="#B8C5D6" transparent opacity={0.1} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

// ===== 主控制器：完整时间线 + 音效 =====
export default function DemoController() {
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const setDemoPhase = useCityStore((s) => s.setDemoPhase);
  const setDemoProgress = useCityStore((s) => s.setDemoProgress);
  const setDemoDialogue = useCityStore((s) => s.setDemoDialogue);
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

    // ==== 0-3s: 苍穹俯瞰 ====
    setDemoPhase('aerial');
    tl.set(camera.position, { x: 0, y: 22, z: 14 }, 0);
    tl.call(() => playConvergeWhoosh(), null, 0);
    tl.to(camera.position, { x: 0, y: 10, z: 14, duration: 3, ease: 'power2.inOut' }, 0);

    // ==== 3-6s: 城邦降临 ====
    tl.call(() => { setDemoPhase('descent'); playWhoosh(); }, null, 3);
    tl.to(camera.position, { x: 0, y: 6, z: 12, duration: 3, ease: 'power1.inOut' }, 3);

    // ==== 6-9s: 坊间漫游 ====
    tl.call(() => setDemoPhase('workshop'), null, 6);
    tl.to(camera.position, { x: -3, y: 3.5, z: 4, duration: 3, ease: 'power2.inOut' }, 6);

    // ==== 9-12s: 跨界偶遇 ====
    tl.call(() => { setDemoPhase('encounter'); playWhoosh(); }, null, 9);
    const flight = demoScript.scenes.find((s) => s.id === 'encounter')?.butterflyFlight;
    if (flight) {
      const bf = { x: flight.start[0], y: flight.start[1], z: flight.start[2] };
      tl.to(bf, {
        x: flight.end[0], y: flight.end[1], z: flight.end[2],
        duration: 3, ease: 'power1.inOut',
        onUpdate: () => setDemoButterflyPos([bf.x, bf.y, bf.z]),
      }, 9);
    }

    // ==== 12-20s: Agent对话 ====
    tl.call(() => setDemoPhase('dialogue'), null, 12);
    tl.to(camera.position, { x: -2, y: 3, z: 5, duration: 4, ease: 'power1.inOut' }, 12);

    const dialogueScene = demoScript.scenes.find((s) => s.id === 'dialogue');
    dialogueScene?.dialogues.forEach((d) => {
      tl.call(() => {
        setDemoDialogue({ speaker: d.speaker, text: d.text });
        // 打字音效
        const charCount = d.text.length;
        const duration = charCount * 0.05; // 50ms per char
        const tickCount = Math.floor(duration / 0.12);
        for (let i = 0; i < tickCount; i++) {
          tl.call(() => playTypeSound(), null, 12 + d.time + i * 0.12);
        }
      }, null, 12 + d.time);
    });

    // ==== 20-24s: 人脉溯源 ====
    tl.call(() => {
      setDemoPhase('trace');
      setTraceActive(true);
      playWhoosh();
    }, null, 20);

    const traceScene = demoScript.scenes.find((s) => s.id === 'trace');
    traceScene?.tracePath.forEach((_, i) => {
      tl.call(() => advanceTrace(), null, 20 + i * 0.8);
    });

    tl.to(camera.position, { x: 0, y: 8, z: 12, duration: 4, ease: 'power1.inOut' }, 20);

    // ==== 24-27s: 新人入驻 ====
    tl.call(() => {
      setDemoPhase('welcome');
      setTraceActive(false);
      setResidentActive(true);
    }, null, 24);

    const residentObj = { v: 0 };
    tl.to(residentObj, {
      v: 1, duration: 2.5, ease: 'back.out(1.7)',
      onUpdate: () => setResidentProgress(residentObj.v),
    }, 24);

    tl.to(camera.position, { x: 0, y: 5, z: 7, duration: 2, ease: 'power1.out' }, 25);

    return () => {};
  }, [demoPlaying]);

  useFrame(() => {});

  return null;
}
