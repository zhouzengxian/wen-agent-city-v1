import { useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';

// Canvas 纹理生成器 - 绘制国风角色头像
function generateAgentTexture(emoji, color) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 外发光光环
  const glowGrad = ctx.createRadialGradient(64, 64, 20, 64, 64, 64);
  glowGrad.addColorStop(0, color);
  glowGrad.addColorStop(0.5, color + '60');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, size, size);

  // 深色底圆
  ctx.beginPath();
  ctx.arc(64, 64, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a2e';
  ctx.fill();

  // 金色边框
  ctx.beginPath();
  ctx.arc(64, 64, 48, 0, Math.PI * 2);
  ctx.strokeStyle = '#c9a96e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 内圈装饰
  ctx.beginPath();
  ctx.arc(64, 64, 42, 0, Math.PI * 2);
  ctx.strokeStyle = color + '80';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 颜色渐变底板
  const innerGrad = ctx.createRadialGradient(64, 64, 10, 64, 64, 44);
  innerGrad.addColorStop(0, color + '40');
  innerGrad.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(64, 64, 44, 0, Math.PI * 2);
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // Emoji
  ctx.font = '52px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// 缓存纹理避免重复生成
const textureCache = {};
function getAgentTexture(emoji, color) {
  const key = `${emoji}-${color}`;
  if (!textureCache[key]) {
    textureCache[key] = generateAgentTexture(emoji, color);
  }
  return textureCache[key];
}

export default function AgentSprite({ agent, selectAgent, camera }) {
  const groupRef = useRef();
  const floatRef = useRef();
  const ringRef = useRef();
  const spriteRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { size } = useThree();

  const texture = useMemo(() => getAgentTexture(agent.emoji, agent.color), [agent.emoji, agent.color]);

  // 动画
  useFrame((state) => {
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + agent.position[0]) * 0.25;
    }
    if (ringRef.current) {
      const target = hovered ? 1.5 : 1;
      ringRef.current.scale.lerp(
        new THREE.Vector3(target, target, target),
        0.12
      );
      ringRef.current.material.opacity += ((hovered ? 0.6 : 0.25) - ringRef.current.material.opacity) * 0.12;
    }
    if (glowRef.current) {
      glowRef.current.material.opacity += ((hovered ? 0.45 : 0.15) - glowRef.current.material.opacity) * 0.12;
    }
    // 头像轻微旋转面向相机效果
    if (spriteRef.current) {
      spriteRef.current.scale.x += (1 - spriteRef.current.scale.x) * 0.1;
      spriteRef.current.scale.y += (1 - spriteRef.current.scale.y) * 0.1;
      if (hovered) {
        spriteRef.current.scale.set(1.15, 1.15, 1.15);
      }
    }
  });

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    const vector = new THREE.Vector3();
    groupRef.current.getWorldPosition(vector);
    vector.project(camera);
    const screenX = (vector.x * 0.5 + 0.5) * size.width;
    const screenY = (-vector.y * 0.5 + 0.5) * size.height;
    selectAgent(agent, { x: screenX, y: screenY });
  }, [agent, camera, size, selectAgent]);

  const interactProps = {
    onPointerDown: handlePointerDown,
    onPointerOver: (e) => { e.stopPropagation(); setHovered(true); },
    onPointerOut: (e) => { e.stopPropagation(); setHovered(false); },
  };

  return (
    <group ref={groupRef} position={[agent.position[0], agent.position[1], agent.position[2]]}>
      <group ref={floatRef}>
        {/* 地面光环 */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} {...interactProps}>
          <ringGeometry args={[0.4, 0.55, 48]} />
          <meshBasicMaterial color={agent.color} transparent opacity={0.25} side={2} depthWrite={false} />
        </mesh>

        {/* 大型发光底座 */}
        <mesh ref={glowRef} position={[0, -0.05, 0]} {...interactProps}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>

        {/* 底座六角台 */}
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.12, 6]} />
          <meshStandardMaterial color="#2a2a3a" emissive={agent.color} emissiveIntensity={0.15} />
        </mesh>

        {/* Agent头像 - 主要显示 */}
        <Billboard ref={spriteRef} position={[0, 0.15, 0]}>
          <mesh {...interactProps}>
            <planeGeometry args={[0.85, 0.85]} />
            <meshBasicMaterial
              map={texture}
              transparent
              depthWrite={false}
            />
          </mesh>
        </Billboard>

        {/* 名字标签 */}
        <Billboard position={[0, 0.75, 0]}>
          <Text
            fontSize={0.18}
            color={hovered ? '#ffffff' : '#e8d5a3'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#0a0a1a"
            fontWeight="bold"
          >
            {agent.name}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.1}
            color={agent.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#0a0a1a"
          >
            {agent.title}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}
