import { useMemo, useRef } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3, CatmullRomCurve3, TubeGeometry, MeshBasicMaterial } from 'three';

export default function ConnectionLines({ connections, agents }) {
  const agentMap = {};
  agents.forEach((a) => { agentMap[a.id] = a; });

  return (
    <group>
      {connections.map((conn, i) => {
        const fromAgent = agentMap[conn.from];
        const toAgent = agentMap[conn.to];
        if (!fromAgent || !toAgent) return null;

        const from = new Vector3(fromAgent.position[0], 0.05, fromAgent.position[2]);
        const to = new Vector3(toAgent.position[0], 0.05, toAgent.position[2]);
        const mid = new Vector3().addVectors(from, to).multiplyScalar(0.5);
        mid.z += (from.x - to.x) * 0.3;
        mid.y += 0.5;
        const labelPos = mid.clone();

        return (
          <group key={`${conn.from}-${conn.to}-${i}`}>
            {/* 淡色连线 */}
            <TubeLine points={[from, mid, to]} color={fromAgent.color} opacity={0.15} radius={0.015} />
            {/* 悬浮标签 */}
            <FloatingLabel position={labelPos} label={conn.label} color={fromAgent.color} />
          </group>
        );
      })}
    </group>
  );
}

// 可靠的 Tube 管线组件
function TubeLine({ points, color, opacity, radius }) {
  const curve = useMemo(() => new CatmullRomCurve3(points), [points]);
  const geometry = useMemo(() => new TubeGeometry(curve, 42, radius, 6, false), [curve, radius]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

// 清晰可见的悬浮标签
function FloatingLabel({ position, label, color }) {
  return (
    <Billboard position={position}>
      <Text
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
        depthTest={false}
        renderOrder={999}
      >
        {label}
      </Text>
    </Billboard>
  );
}
