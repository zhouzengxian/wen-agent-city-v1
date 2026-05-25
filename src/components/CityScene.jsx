import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import useCityStore from '../store/useCityStore';
import { agents, districts, connections } from '../data/gameData';
import DistrictGround from './DistrictGround';
import AgentSprite from './AgentSprite';
import ConnectionLines from './ConnectionLines';
import { AgentSparkles, StarField } from './SparkleField';
import DemoController, { DemoConvergeParticles, ButterflyTrail, TraceHighlights, WelcomeResident } from './DemoController';

export default function CityScene() {
  const selectAgent = useCityStore((s) => s.selectAgent);
  const deselectAgent = useCityStore((s) => s.deselectAgent);
  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const autoRotate = useCityStore((s) => s.autoRotate);
  const setAutoRotate = useCityStore((s) => s.setAutoRotate);
  const { camera } = useThree();

  const handleBgClick = useCallback((e) => {
    if (!e.object || e.object.name === 'ground') deselectAgent();
  }, [deselectAgent]);

  return (
    <>
      <DemoController />

      <OrbitControls
        enableDamping dampingFactor={0.08}
        minPolarAngle={0.2} maxPolarAngle={Math.PI / 2.3}
        minDistance={5} maxDistance={30}
        target={[0, 0, 0]}
        enabled={!demoPlaying}
        autoRotate={autoRotate}
        autoRotateSpeed={0.3}
        onStart={() => { if (autoRotate) setAutoRotate(false); }}
      />

      <ambientLight intensity={0.25} color="#1a2a40" />
      <directionalLight position={[15, 25, 10]} intensity={0.6} color="#e8d5a3" />
      <pointLight position={[0, 12, 0]} intensity={1.2} color="#c9a96e" distance={35} decay={2} />
      <pointLight position={[0, -1, 0]} intensity={0.3} color="#6a4a8a" distance={15} />
      <pointLight position={[-8, 3, -6]} intensity={0.4} color="#4a6a8a" distance={15} />
      <pointLight position={[8, 3, -6]} intensity={0.3} color="#8a4a6a" distance={15} />
      <pointLight position={[-6, 3, 7]} intensity={0.3} color="#4a8a6a" distance={15} />
      <pointLight position={[6, 3, 7]} intensity={0.35} color="#8a6a4a" distance={15} />

      <fog attach="fog" args={['#0a0a1a', 10, 45]} />

      <mesh name="ground" position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleBgClick} visible={false}>
        <planeGeometry args={[60, 60]} /><meshBasicMaterial />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <circleGeometry args={[12, 80]} />
        <meshStandardMaterial color="#141428" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.59, 0]}>
        <ringGeometry args={[10, 12, 80]} />
        <meshBasicMaterial color="#1a1a3a" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.585, 0]}>
        <ringGeometry args={[11.8, 12, 80]} />
        <meshBasicMaterial color="#c9a96e" transparent opacity={0.4} />
      </mesh>
      {[3, 6, 9].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, 0]}>
          <ringGeometry args={[r, r + 0.02, 80]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.15 - r * 0.012} />
        </mesh>
      ))}
      <CrossHair />

      <DemoConvergeParticles />
      <ButterflyTrail />
      <TraceHighlights connections={connections} agents={agents} />
      <WelcomeResident />

      {districts.map((d) => <DistrictGround key={d.id} district={d} />)}
      {agents.map((agent) => (
        <group key={agent.id}>
          <AgentSprite agent={agent} selectAgent={selectAgent} camera={camera} />
          <AgentSparkles agent={agent} count={18} />
        </group>
      ))}
      <ConnectionLines connections={connections} agents={agents} />
      <StarField count={400} />
    </>
  );
}

function CrossHair() {
  return (
    <group position={[0, -0.57, 0]}>
      <mesh><planeGeometry args={[24, 0.02]} /><meshBasicMaterial color="#c9a96e" transparent opacity={0.08} depthWrite={false} /></mesh>
      <mesh><planeGeometry args={[0.02, 24]} /><meshBasicMaterial color="#c9a96e" transparent opacity={0.08} depthWrite={false} /></mesh>
    </group>
  );
}
