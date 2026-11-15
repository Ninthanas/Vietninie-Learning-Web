import { useEffect, useRef } from 'react';
import { createMascot } from './engine';

/**
 * Interactive 3D mascot (Ni Ni). Pure WebGL, no extra dependencies.
 * - follows the cursor, idle bounce, blinks
 * - click => waves for a moment
 * - pauses when scrolled out of view or when reduced motion is requested
 */
export default function Mascot3D({ pose = 0, mouth = 'open', zoom = 5.6, className = '', label = 'Ni Ni, linh vật của Vietninie' }) {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const api = createMascot(canvas, { pose, mouth, zoom, reducedMotion: reduced });
    apiRef.current = api;
    if (!api) return undefined;

    const ro = new ResizeObserver(() => api.resize());
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => api.setRunning(entry.isIntersecting), { threshold: 0.05 });
    io.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      api.dispose();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { apiRef.current?.setPose(pose); }, [pose]);
  useEffect(() => { apiRef.current?.setMouth(mouth); }, [mouth]);

  return (
    <canvas
      ref={canvasRef}
      className={`mascot3d ${className}`}
      role="img"
      aria-label={label}
      onClick={() => apiRef.current?.wave()}
    />
  );
}
