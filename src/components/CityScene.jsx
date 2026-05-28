import { useCallback, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import useCityStore from '../store/useCityStore';
import { agents, districts, connections, tier1Agents } from '../data/gameData';
import AgentSprite from './AgentSprite';
import { AgentSparkles } from './SparkleField';
import { AgentNebula, DistrictAmbient, DeepSpaceStars, CosmicDust, Tier3Starfield, Tier2Starfield, useInfluenceMap } from './SpaceElements';
import { useForceGraph } from '../hooks/useForceGraph';
import DemoController, { DemoConvergeParticles, ButterflyTrail, TraceHighlights, WelcomeResident, DemoHighlightGlow } from './DemoController';

// 模块级 ref：供 DemoController 直接操控 OrbitControls 的 target
export const orbitControlsRef = { current: null };

function ForceLines({ connections, getPos }) {
  return (
    <group>
      {connections.map((conn) => {
        const fromAgent = agents.find((a) => a.id === conn.from);
        return <ForceLine key={`${conn.from}-${conn.to}`} conn={conn} getPos={getPos} color={fromAgent?.color || '#ffffff'} />;
      })}
    </group>
  );
}

function ForceLine({ conn, getPos, color }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const vf = useRef(new THREE.Vector3());
  const vt = useRef(new THREE.Vector3());
  const vd = useRef(new THREE.Vector3());

  useFrame(() => {
    const [fx, fy, fz] = getPos(conn.from);
    const [tx, ty, tz] = getPos(conn.to);
    vf.current.set(fx, fy, fz);
    vt.current.set(tx, ty, tz);
    vd.current.subVectors(vt.current, vf.current);
    const len = vd.current.length();
    if (len < 0.001) return;
    const mid = new THREE.Vector3().addVectors(vf.current, vt.current).multiplyScalar(0.5);
    if (meshRef.current) {
      meshRef.current.position.copy(mid);
      meshRef.current.scale.set(1, len, 1);
      meshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vd.current.normalize());
    }
    if (glowRef.current) {
      glowRef.current.position.copy(mid);
      glowRef.current.scale.set(1, len, 1);
      glowRef.current.quaternion.copy(meshRef.current?.quaternion || new THREE.Quaternion());
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.01, 0.01, 1, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={glowRef}>
        <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function CityScene() {
  const selectAgent = useCityStore((s) => s.selectAgent);
  const deselectAgent = useCityStore((s) => s.deselectAgent);
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const autoRotate = useCityStore((s) => s.autoRotate);
  const setAutoRotate = useCityStore((s) => s.setAutoRotate);
  const { camera } = useThree();

  // 强力紧凑布局：短弹簧 + 强锚定 + 高排斥防重叠
  const { getPos, startDrag, moveDrag, endDrag, isDragging } = useForceGraph(agents, connections, districts, {
    repulsion: 12, springForce: 0.06, centerForce: 0.025, districtAnchor: 0.10,
  });

  // 影响力地图
  const influenceMap = useInfluenceMap();

  const handleBgClick = useCallback((e) => {
    if (!e.object || e.object.name === 'space') deselectAgent();
  }, [deselectAgent]);

  return (
    <>
      <DemoController />

      <OrbitControls
        ref={(ref) => { orbitControlsRef.current = ref; }}
        enableDamping dampingFactor={0.1}
        minPolarAngle={0.05} maxPolarAngle={Math.PI / 2}
        minDistance={3} maxDistance={80}
        enabled={!demoPlaying}
        enableRotate={!demoPlaying}
        enableZoom={!demoPlaying}
        enablePan={!demoPlaying}
        autoRotate={autoRotate && !demoPlaying}
        autoRotateSpeed={0.15}
        onStart={() => { if (autoRotate) setAutoRotate(false); }}
      />

      <ambientLight intensity={0.15} color="#050520" />
      <directionalLight position={[20, 30, 15]} intensity={0.25} color="#8899cc" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#8899dd" distance={30} decay={2} />
      <pointLight position={[-8, 2, -4]} intensity={0.4} color="#8a6a5a" distance={15} />
      <pointLight position={[8, 2, -4]} intensity={0.3} color="#6a4a8a" distance={15} />
      <pointLight position={[-6, 2, 6]} intensity={0.3} color="#4a6a8a" distance={15} />
      <pointLight position={[6, 2, 6]} intensity={0.35} color="#8a6a5a" distance={15} />
      <fog attach="fog" args={['#000010', 35, 100]} />

      <mesh name="space" position={[0, -2, 0]} onClick={handleBgClick} visible={false}>
        <planeGeometry args={[120, 120]} /><meshBasicMaterial />
      </mesh>

      {/* ==== 背景层 ==== */}
      <DeepSpaceStars count={2500} />
      <CosmicDust />
      {districts.map((d) => <DistrictAmbient key={d.id} district={d} />)}

      {/* ==== Demo特效 ==== */}
      <DemoConvergeParticles />
      <ButterflyTrail />
      <TraceHighlights connections={connections} agents={agents} />
      <WelcomeResident />

      {/* ==== Demo 说话者高亮 ==== */}
      <DemoHighlightGlow getPos={getPos} />

      {/* ==== Tier-3 繁星（780颗微光粒子） ==== */}
      <Tier3Starfield agents={agents} getPhysPos={getPos} />

      {/* ==== Tier-2 精英节点（180个可见星点，波动闪烁） ==== */}
      <Tier2Starfield agents={agents} getPhysPos={getPos} />

      {/* ==== Tier-1 英雄节点（40个，带影响力星云） ==== */}
      {tier1Agents.map((agent) => {
        const influence = influenceMap[agent.id] || 3;
        return (
          <group key={agent.id}>
            <AgentNebula agent={agent} getPhysPos={getPos} influence={influence} />
            <AgentSprite agent={agent} selectAgent={selectAgent} camera={camera}
              getPhysPos={getPos} startDrag={startDrag} moveDrag={moveDrag}
              endDrag={endDrag} isDragging={isDragging} />
            {!isDragging?.() && <AgentSparkles agent={agent} count={12} />}
          </group>
        );
      })}

      {/* ==== 知识连线 ==== */}
      <ForceLines connections={connections} getPos={getPos} />
    </>
  );
}


