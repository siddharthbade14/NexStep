import React, { useEffect, useRef } from 'react';

export const HeroCyberCanvas = ({ className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates in 3D normalized space
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetRotY = x * 0.8;
      targetRotX = -y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Particles setup
    const numParticles = 75;
    const particles = [];
    const sphereRadius = Math.min(width, height) * 0.45;

    for (let i = 0; i < numParticles; i++) {
      // Golden spiral distribution on sphere surface
      const phi = Math.acos(1 - 2 * (i + 0.5) / numParticles);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const r = sphereRadius * (0.7 + Math.random() * 0.4);
      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: i % 4 === 0 ? '#F4B942' : i % 3 === 0 ? '#10B981' : '#2C6E8F',
        size: Math.random() * 2.5 + 1.5,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let time = 0;
    const cameraZ = 600;

    const render = () => {
      time += 0.015;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const currentRotY = rotY + time * 0.2;
      const currentRotX = rotX + Math.sin(time * 0.5) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Precompute rotation sines and cosines
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Projected points
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Rotate around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective 3D projection
        const depth = cameraZ + z2;
        if (depth > 50) {
          const scale = cameraZ / depth;
          const projX = width / 2 + x1 * scale;
          const projY = height / 2 + y2 * scale;
          const alpha = Math.max(0.15, Math.min(0.9, (z2 + sphereRadius) / (sphereRadius * 2)));

          projected.push({
            x: projX,
            y: projY,
            z: z2,
            scale,
            alpha,
            color: p.color,
            size: p.size * scale,
            pulse: Math.sin(time * 3 + p.pulseOffset) * 0.3 + 0.7
          });
        }
      }

      // Sort by depth for correct 3D occlusions
      projected.sort((a, b) => a.z - b.z);

      // Draw connecting holographic filaments
      const maxConnectDist = 95;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * p1.alpha * p2.alpha * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(44, 110, 143, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw 3D glowing particle nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const r = Math.max(1, p.size * p.pulse);

        // Radial glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.5);
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.globalAlpha = p.alpha * 0.8;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
};
