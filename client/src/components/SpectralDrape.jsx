import { useEffect, useRef } from 'react';

/**
 * SpectralDrape — fundo animado original: grade de dots com glow que se
 * dobra em 3D (projeção em perspectiva + ondas viajantes em Z).
 * Inspirado na ideia do componente homônimo do React Bits Pro; código 100%
 * próprio, sem dependências, adaptado aos tokens do projeto (roxo → teal).
 *
 * Acessibilidade: aria-hidden + pointer-events via CSS; com
 * prefers-reduced-motion renderiza um frame estático, sem loop.
 * Performance: DPR limitado, pausa fora da viewport, densidade menor no mobile.
 */

const PURPLE = [126, 34, 206];
const TEAL = [84, 210, 208];

function lerpColor(t) {
  const c = PURPLE.map((p, i) => Math.round(p + (TEAL[i] - p) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

export default function SpectralDrape({
  density = 26,
  speed = 1,
  amplitude = 46,
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const gap = w < 640 ? density * 1.35 : density;
      const cols = Math.max(2, Math.floor(w / gap));
      const rows = Math.max(2, Math.floor(h / gap));
      const focal = Math.max(w, h) * 1.1;
      const cx = w / 2;
      const cy = h * 0.42;

      for (let j = 0; j <= rows; j++) {
        const v = j / rows;
        for (let i = 0; i <= cols; i++) {
          const u = i / cols;
          const x = (u - 0.5) * w * 1.15;
          // Drape: o tecido cede no centro (curva de catenária aproximada)
          const sag = Math.cos((u - 0.5) * Math.PI) * h * 0.16;
          const y = (v - 0.5) * h * 0.9 + sag * v;
          // Dobras 3D: duas ondas viajantes em Z
          const z =
            Math.sin(u * Math.PI * 3 + t * 0.9 * speed) * amplitude * (0.4 + v * 0.6) +
            Math.sin(v * Math.PI * 2 - t * 0.6 * speed + u * 2) * amplitude * 0.45;
          const s = focal / (focal + z + amplitude * 1.2);
          const sx = cx + x * s;
          const sy = cy + y * s;
          if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;
          const depth = Math.min(1, Math.max(0, (s - 0.75) / 0.5));
          const r = 0.8 + depth * 2.1;
          ctx.globalAlpha = 0.12 + depth * 0.75;
          ctx.fillStyle = lerpColor(u);
          // Halo (barato) + núcleo — evita shadowBlur, que custa caro por dot
          ctx.beginPath();
          ctx.arc(sx, sy, r * 3.2, 0, Math.PI * 2);
          ctx.globalAlpha *= 0.22;
          ctx.fill();
          ctx.globalAlpha = 0.12 + depth * 0.75;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      resize();
      draw(0.6);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) loop();
      },
      { threshold: 0 },
    );

    const ro = new ResizeObserver(resize);
    const onVisibility = () => {
      running = !document.hidden;
      if (running) loop();
    };

    let last = -1;
    const loop = () => {
      cancelAnimationFrame(raf);
      const tick = (now) => {
        if (!running) return;
        // Redesenha só se passou tempo suficiente (~30fps bastam para o drape)
        if (now - last > 33) {
          last = now;
          draw(now / 1000);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    resize();
    io.observe(canvas);
    ro.observe(canvas.parentElement);
    document.addEventListener('visibilitychange', onVisibility);
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, speed, amplitude]);

  return <canvas ref={ref} className={`drape-canvas${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
