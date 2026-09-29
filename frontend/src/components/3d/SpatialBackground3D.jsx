import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// 3D Rotating Interactive Particle Constellation Mesh
function ParticleField({ mouseRef, isDark }) {
  const pointsRef = useRef();
  const count = 280;

  // Generate spherical and plane particles
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const darkPalette = [
      new THREE.Color('#2DD4BF'), // Cyber Teal
      new THREE.Color('#FBBF24'), // Gold
      new THREE.Color('#A855F7'), // Amethyst
      new THREE.Color('#38BDF8')  // Sky Cyan
    ];

    const lightPalette = [
      new THREE.Color('#0D9488'), // Rich Teal
      new THREE.Color('#D97706'), // Deep Amber
      new THREE.Color('#7C3AED'), // Royal Violet
      new THREE.Color('#0284C7')  // Ocean Blue
    ];

    const palette = isDark ? darkPalette : lightPalette;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 24;
      pos[i3 + 1] = (Math.random() - 0.5) * 16;
      pos[i3 + 2] = (Math.random() - 0.5) * 16 - 2;

      const chosenColor = palette[i % palette.length];
      col[i3] = chosenColor.r;
      col[i3 + 1] = chosenColor.g;
      col[i3 + 2] = chosenColor.b;
    }
    return [pos, col];
  }, [count, isDark]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Slow ambient rotation
    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x += delta * 0.012;

    // Reactive camera tilt damping to mouse position
    const targetX = (mouseRef.current.x * 0.5);
    const targetY = (mouseRef.current.y * 0.35);

    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isDark ? 0.12 : 0.1}
        vertexColors
        transparent
        opacity={isDark ? 0.7 : 0.4}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3D Isometric Undulating Wireframe Grid
function IsometricSpatialGrid({ mouseRef, isDark }) {
  const meshRef = useRef();

  const { gridGeometry } = useMemo(() => {
    const size = 30;
    const divisions = 30;
    const geom = new THREE.PlaneGeometry(size, size, divisions, divisions);
    geom.rotateX(-Math.PI / 2.3);
    return { gridGeometry: geom };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * 0.5;

    // Gentle wave undulation
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.35 + time) * 0.3 + Math.cos(v * 0.35 + time * 0.8) * 0.25;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    // Subtle parallax tilt from mouse
    meshRef.current.rotation.z = mouseRef.current.x * 0.03;
  });

  return (
    <mesh ref={meshRef} position={[0, -4.5, -4]} geometry={gridGeometry}>
      <meshBasicMaterial
        wireframe
        color={isDark ? "#1E293B" : "#CBD5E1"}
        transparent
        opacity={isDark ? 0.35 : 0.4}
      />
    </mesh>
  );
}

export const SpatialBackground3D = ({ className = "" }) => {
  const { isDark } = useTheme();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-500 ${className}`}>
      {/* Dynamic Background Base */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 70% at 50% 10%, #0F172A 0%, #0B1120 70%, #060913 100%)'
            : 'radial-gradient(ellipse 90% 70% at 50% 10%, #F1F5F9 0%, #F8FAFC 70%, #E2E8F0 100%)'
        }}
      />

      {/* Cyber Ambient Accent Orbs */}
      <div 
        className={`absolute top-10 left-1/4 w-[600px] h-[350px] blur-[130px] rounded-full pointer-events-none transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-tr from-teal-500/12 via-indigo-600/10 to-purple-600/12'
            : 'bg-gradient-to-tr from-teal-400/10 via-sky-300/10 to-indigo-300/10'
        }`} 
      />
      <div 
        className={`absolute top-1/3 -right-20 w-[500px] h-[450px] blur-[140px] rounded-full pointer-events-none transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-bl from-amber-500/10 via-rose-500/8 to-purple-600/10'
            : 'bg-gradient-to-bl from-amber-300/10 via-orange-200/10 to-rose-200/10'
        }`} 
      />
      <div 
        className={`absolute -bottom-20 left-1/3 w-[650px] h-[400px] blur-[120px] rounded-full pointer-events-none transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-t from-teal-600/10 via-cyan-500/6 to-transparent'
            : 'bg-gradient-to-t from-emerald-300/10 via-teal-200/8 to-transparent'
        }`} 
      />

      {/* Real React Three Fiber 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={isDark ? 0.5 : 0.8} />
        <ParticleField mouseRef={mouseRef} isDark={isDark} />
        <IsometricSpatialGrid mouseRef={mouseRef} isDark={isDark} />
      </Canvas>

      {/* Subtle Noise / Radial Vignette Overlay */}
      {isDark && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, transparent 30%, rgba(6, 9, 19, 0.6) 100%)'
          }}
        />
      )}
    </div>
  );
};
