import { Canvas } from '@react-three/fiber';
import CityScene from './components/CityScene';
import DialogueOverlay from './components/DialogueOverlay';
import DemoOverlay from './components/DemoOverlay';
import CityUI from './components/CityUI';
import PhoneApp from './components/PhoneApp';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CityUI />
      <Canvas
        camera={{ position: [0, 12, 14], fov: 50, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => { gl.setClearColor('#0a0a1a'); }}
      >
        <CityScene />
      </Canvas>
      <DialogueOverlay />
      <DemoOverlay />
      <PhoneApp />
    </div>
  );
}
