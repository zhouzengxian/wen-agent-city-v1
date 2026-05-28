import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import useCityStore from '../store/useCityStore';

// 星体纹理
function generateStarTexture(color) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  const glow = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
  glow.addColorStop(0, color);
  glow.addColorStop(0.2, color + 'aa');
  glow.addColorStop(0.5, color + '20');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  const core = ctx.createRadialGradient(64, 64, 0, 64, 64, 20);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.3, color);
  core.addColorStop(0.7, color + '80');
  core.addColorStop(1, 'transparent');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(64, 64, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff40';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const angle = (i * 45) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(64, 64);
    ctx.lineTo(64 + Math.cos(angle) * 35, 64 + Math.sin(angle) * 35);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(canvas);
  t.needsUpdate = true;
  t.minFilter = THREE.LinearFilter;
  return t;
}
const texCache = {};
function getStarTex(c) { if (!texCache[c]) texCache[c] = generateStarTexture(c); return texCache[c]; }

export default function AgentSprite({ agent, selectAgent, camera, getPhysPos, startDrag, moveDrag, endDrag, isDragging }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const glowMeshRef = useRef();
  const starMeshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { size } = useThree();

  const demoPlaying = useCityStore((s) => s.demoPlaying);
  const demoButterflyPos = useCityStore((s) => s.demoButterflyPos);
  // Demo飞行特效：如果当前Agent的id匹配demo飞行对象，优先使用demo位置
  const isDemoFlyTarget = demoButterflyPos && demoPlaying;
  const texture = useMemo(() => getStarTex(agent.color), [agent.color]);

  // 物理位置更新
  useFrame(() => {
    // Demo飞行优先（适配新demo中的跨坊区粒子流）
    if (isDemoFlyTarget && demoButterflyPos) {
      if (groupRef.current) {
        const [tx, ty, tz] = demoButterflyPos;
        groupRef.current.position.set(tx, ty, tz);
      }
      return;
    }
    // 力导向位置（非拖拽中从物理引擎更新）
    if (getPhysPos && !dragData.current.active) {
      const [px, py, pz] = getPhysPos(agent.id);
      groupRef.current.position.set(px, py, pz);
    }
    // 拖拽中：moveDrag已经更新了物理位置，这里只需同步position
    // position已在handleMove中通过groupRef直接设置

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.003;
      const t = hovered ? 1.5 : 1;
      ringRef.current.scale.lerp(new THREE.Vector3(t, t, t), 0.1);
      ringRef.current.material.opacity += ((hovered ? 0.7 : 0.3) - ringRef.current.material.opacity) * 0.1;
    }
    if (glowMeshRef.current) {
      const m = glowMeshRef.current.material;
      m.opacity += ((hovered ? 0.5 : 0.2) - m.opacity) * 0.1;
    }
    if (starMeshRef.current) {
      const s = hovered ? 1.3 : 1;
      starMeshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
  });

  const dragData = useRef({ active: false, startPos: new THREE.Vector3(), dist: 0, lastClickTime: 0 });
  const { raycaster, gl } = useThree();

  // 简洁的 onClick —— 左键点击直接选节点
  const handleClick = useCallback((e) => {
    if (demoPlaying) return;
    e.stopPropagation();
    const now = Date.now();
    // 如果刚刚结束拖拽，忽略此点击
    if (dragData.current.dist > 0.3) {
      dragData.current.dist = 0;
      return;
    }
    selectAgent(agent, {
      x: e.nativeEvent?.clientX ?? e.clientX ?? 0,
      y: e.nativeEvent?.clientY ?? e.clientY ?? 0,
    });
  }, [demoPlaying, selectAgent, agent]);

  const handlePointerDown = useCallback((e) => {
    if (demoPlaying) return;
    e.stopPropagation();
    const p = new THREE.Vector3();
    groupRef.current.getWorldPosition(p);
    dragData.current = { ...dragData.current, active: true, startPos: p.clone(), dist: 0 };
    gl.domElement.style.cursor = 'grabbing';
  }, [demoPlaying, gl]);

  const handlePointerUp = useCallback(() => {
    if (!dragData.current.active) return;
    const didDrag = dragData.current.dist > 0.3;
    dragData.current.active = false;
    gl.domElement.style.cursor = 'auto';
    if (didDrag) {
      endDrag?.();
    }
    // onClick 处理剩下的非拖拽情况
  }, [endDrag, gl]);

  // 全局pointerMove处理拖拽
  useEffect(() => {
    const handleMove = (e) => {
      if (!dragData.current.active || !moveDrag || !groupRef.current) return;
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), target);
      if (target) {
        dragData.current.dist = target.distanceTo(dragData.current.startPos);
        // 拖动超过阈值才锁定物理
        if (dragData.current.dist > 0.3 && !isDragging?.()) {
          startDrag?.(agent.id);
        }
        groupRef.current.position.copy(target);
        moveDrag(agent.id, target);
      }
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [agent.id, camera, gl, moveDrag, raycaster, handlePointerUp, startDrag, isDragging]);

  const ip = demoPlaying ? {} : {
    onPointerDown: handlePointerDown,
    onPointerOver: (e) => { e.stopPropagation(); setHovered(true); },
    onPointerOut: (e) => { e.stopPropagation(); setHovered(false); },
    onClick: handleClick,
  };

  return (
    <group ref={groupRef} position={[agent.position[0], agent.position[1] || 0, agent.position[2]]}>
      <Billboard>
        <mesh ref={glowMeshRef}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial map={texture} transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </Billboard>
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]} {...ip}>
        <ringGeometry args={[0.35, 0.42, 64]} />
        <meshBasicMaterial color={agent.color} transparent opacity={0.3} side={2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <Billboard>
        <mesh ref={starMeshRef} {...ip}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshBasicMaterial map={texture} transparent depthWrite={false} />
        </mesh>
      </Billboard>
      <Billboard position={[0, 0.7, 0]}>
        <Text fontSize={0.16} color="#e8f0ff" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000">
          {agent.name}
        </Text>
        <Text position={[0, -0.18, 0]} fontSize={0.09} color={agent.color} anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000000">
          {agent.title}
        </Text>
      </Billboard>
    </group>
  );
}
