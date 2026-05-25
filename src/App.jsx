import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CityScene from './components/CityScene';
import DialogueOverlay from './components/DialogueOverlay';
import CityUI from './components/CityUI';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 顶部标题栏 */}
      <CityUI />

      {/* 3D 画布 */}
      <Canvas
        camera={{ position: [0, 12, 14], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0a0a1a');
        }}
      >
        <CityScene />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.3}
          minDistance={5}
          maxDistance={30}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* HTML 对话气泡覆盖层 */}
      <DialogueOverlay />
    </div>
  );
}
