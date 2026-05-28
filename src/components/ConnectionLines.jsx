import * as THREE from 'three';

// 直线星座连线 - 简洁利落
export default function ConnectionLines({ connections, agents }) {
  const agentMap = {};
  agents.forEach((a) => { agentMap[a.id] = a; });

  return (
    <group>
      {connections.map((conn, i) => {
        const fromA = agentMap[conn.from];
        const toA = agentMap[conn.to];
        if (!fromA || !toA) return null;

        const from = new THREE.Vector3(fromA.position[0], 0, fromA.position[2]);
        const to = new THREE.Vector3(toA.position[0], 0, toA.position[2]);

        return (
          <StraightLine key={`${conn.from}-${conn.to}-${i}`}
            from={from} to={to} color={fromA.color} />
        );
      })}
    </group>
  );
}

function StraightLine({ from, to, color }) {
  // 管状直线
  const dir = new THREE.Vector3().subVectors(to, from);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const len = dir.length();

  return (
    <group>
      {/* 主线 */}
      <mesh position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), dir.normalize()
      )}>
        <cylinderGeometry args={[0.01, 0.01, len, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* 外层辉光 */}
      <mesh position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), dir.normalize()
      )}>
        <cylinderGeometry args={[0.03, 0.03, len, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
