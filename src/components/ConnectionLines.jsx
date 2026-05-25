import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { FlowDots } from './SparkleField';

export default function ConnectionLines({ connections, agents }) {
  const agentMap = {};
  agents.forEach((a) => { agentMap[a.id] = a; });

  return (
    <group>
      {connections.map((conn, i) => {
        const fromAgent = agentMap[conn.from];
        const toAgent = agentMap[conn.to];
        if (!fromAgent || !toAgent) return null;

        const from = new Vector3(fromAgent.position[0], 0.1, fromAgent.position[2]);
        const to = new Vector3(toAgent.position[0], 0.1, toAgent.position[2]);
        const mid = new Vector3().addVectors(from, to).multiplyScalar(0.5);
        mid.z += (from.x - to.x) * 0.3;

        const linePoints = [from.toArray(), mid.toArray(), to.toArray()];

        return (
          <group key={`${conn.from}-${conn.to}-${i}`}>
            {/* 虚线连线 */}
            <Line
              points={linePoints}
              color={fromAgent.color}
              lineWidth={0.4}
              transparent
              opacity={0.2}
              dashed
              dashSize={0.3}
              gapSize={0.2}
            />
            {/* 流动光点 */}
            <FlowDots points={linePoints} color={fromAgent.color} count={4} />
          </group>
        );
      })}
    </group>
  );
}
