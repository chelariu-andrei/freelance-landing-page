"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * DottedSurface — animated wave of dots (three.js).
 * Integrated from the provided shadcn component. Changes vs. the original, all backwards-compatible:
 *  - `contained`: size to the parent box (absolute) instead of the whole window (fixed). Needed inside sections.
 *  - `color` / `fogColor`: brand colours (e.g. Ac. ink #1c1b1f dots, cream #f9f6f0 fog). Defaults = original.
 *  - `speed`, `amplitude`, `spacing`: wave speed, wave height and grid density (originals: 1, 50, 150).
 *  - Honours prefers-reduced-motion (draws one still frame) and pauses while off-screen.
 *  - Vertex colours normalised to 0–1 (three.js expects 0–1; the original pushed 0–255).
 *  - `-z-1` (not a Tailwind v3 class) → `-z-10`.
 */

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  vertexColors?: boolean;
  /** Fill the parent (which needs `position: relative`) instead of the viewport. Default false. */
  contained?: boolean;
  /** Dot colour (any CSS hex). Default: black in light theme, #c8c8c8 in dark. */
  color?: string;
  /** Colour distant dots fade into — match the background. Default #ffffff. */
  fogColor?: string;
  /** Wave speed multiplier. Default 1. */
  speed?: number;
  /** Wave height in scene units. Default 50 (original). */
  amplitude?: number;
  /** Distance between dots in scene units — lower = denser grid. Default 150 (original). */
  spacing?: number;
};

export function DottedSurface({
  className,
  size = 8,
  opacity = 0.8,
  sizeAttenuation = true,
  vertexColors = true,
  contained = false,
  color,
  fogColor = "#ffffff",
  speed = 1,
  amplitude = 50,
  spacing = 150,
  ...props
}: DottedSurfaceProps) {
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SEPARATION = spacing;
    // Keep the same surface area when density changes (capped for performance).
    const k = Math.min(3, Math.max(0.5, 150 / spacing));
    const AMOUNTX = Math.round(40 * k);
    const AMOUNTY = Math.round(60 * k);

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getSize = () =>
      contained
        ? { w: Math.max(1, container.clientWidth), h: Math.max(1, container.clientHeight) }
        : { w: window.innerWidth, h: window.innerHeight };

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(new THREE.Color(fogColor), 2000, 10000);

    const { w, h } = getSize();
    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 10000);
    camera.position.set(0, 355, 1220);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // No WebGL: render nothing — the section behind still reads fine.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(scene.fog.color, 0);
    renderer.domElement.style.display = "block";

    container.appendChild(renderer.domElement);

    const dot = new THREE.Color(color ?? (theme === "dark" ? "#c8c8c8" : "#000000"));

    // Create particles
    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0; // Will be animated
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, y, z);
        colors.push(dot.r, dot.g, dot.b);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size,
      vertexColors,
      color: vertexColors ? undefined : dot,
      transparent: true,
      opacity,
      sizeAttenuation,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;
    let visible = true;

    const step = () => {
      const positionAttribute = geometry.attributes.position;
      const arr = positionAttribute.array as Float32Array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          arr[i * 3 + 1] = Math.sin((ix + count) * 0.3) * amplitude + Math.sin((iy + count) * 0.5) * amplitude;
          i++;
        }
      }
      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (sceneRef.current) sceneRef.current.animationId = animationId;
      if (!visible) return;
      step();
      count += 0.1 * speed;
    };

    const handleResize = () => {
      const s = getSize();
      camera.aspect = s.w / s.h;
      camera.updateProjectionMatrix();
      renderer.setSize(s.w, s.h);
      if (reduceMotion) step();
    };

    window.addEventListener("resize", handleResize);
    const ro = contained ? new ResizeObserver(handleResize) : null;
    ro?.observe(container);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(container);

    sceneRef.current = { scene, camera, renderer, particles: [points], animationId, count };

    if (reduceMotion) step();
    else animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      ro?.disconnect();
      io.disconnect();
      cancelAnimationFrame(animationId);
      if (sceneRef.current) {
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
            else object.material.dispose();
          }
        });
        sceneRef.current.renderer.dispose();
        if (container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current = null;
      }
    };
  }, [theme, size, opacity, sizeAttenuation, vertexColors, contained, color, fogColor, speed, amplitude, spacing]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden",
        contained ? "absolute inset-0 z-0" : "fixed inset-0 -z-10",
        className,
      )}
      {...props}
    />
  );
}

export default DottedSurface;
