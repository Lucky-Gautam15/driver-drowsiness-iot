import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hologram3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- HOLOGRAM WIREFRAME CORE (Driver Head / Sphere Cyber Mesh) ---
    // Outer wireframe sphere
    const sphereGeo = new THREE.IcosahedronGeometry(6.2, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const wireMesh = new THREE.Mesh(sphereGeo, wireMat);
    scene.add(wireMesh);

    // Inner glowing nodes
    const innerGeo = new THREE.IcosahedronGeometry(4.8, 2);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x22c55e,
      size: 0.18,
      transparent: true,
      opacity: 0.85,
    });
    const innerPoints = new THREE.Points(innerGeo, pointsMat);
    scene.add(innerPoints);

    // Dynamic orbital rings (Telemetry Scanners)
    const ringGeo1 = new THREE.TorusGeometry(8.5, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(9.8, 0.04, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // Floating 3D Space Particles
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 55;
      particlePos[i + 1] = (Math.random() - 0.5) * 40;
      particlePos[i + 2] = (Math.random() - 0.5) * 35;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- MOUSE INTERACTION & PARALLAX ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (event.clientX / innerWidth - 0.5) * 2;
      mouseY = (event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- ANIMATION LOOP ---
    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // 3D Rotations
      wireMesh.rotation.y = elapsedTime * 0.18 + targetX * 0.6;
      wireMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1 + targetY * 0.6;

      innerPoints.rotation.y = -elapsedTime * 0.22;
      innerPoints.rotation.z = Math.cos(elapsedTime * 0.25) * 0.15;

      ring1.rotation.z = elapsedTime * 0.25;
      ring1.rotation.x = Math.PI / 3 + targetY * 0.3;

      ring2.rotation.z = -elapsedTime * 0.2;
      ring2.rotation.y = Math.PI / 4 + targetX * 0.3;

      particleSystem.rotation.y = elapsedTime * 0.03;

      // Subtle breathing scale
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.035;
      wireMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      wireMat.dispose();
      innerGeo.dispose();
      pointsMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="lux-hologram-canvas" />;
}
