// "Data terrain" behind the hero: a field of dots rendered in perspective,
// rippled by layered waves. The camera leans toward the pointer and a bright
// pulse follows it across the surface.

export function startHeroCanvas(canvas: HTMLCanvasElement, animate: boolean) {
  const ctx = canvas.getContext("2d")!;
  const COLS = 72;
  const ROWS = 40;
  const SPACING = 34;
  let w = 0;
  let h = 0;
  let color = "148 160 255";
  let accent = "34 211 238";
  // Pointer in normalised [-1, 1] space, eased toward target.
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: 0, tActive: 0 };
  let running = false;
  let raf = 0;

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    color = s.getPropertyValue("--dot").trim() || color;
    accent = s.getPropertyValue("--dot-accent").trim() || accent;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running) draw(4000);
  }

  function draw(time: number) {
    ctx.clearRect(0, 0, w, h);
    const t = time * 0.001;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    pointer.active += (pointer.tActive - pointer.active) * 0.05;

    const fov = Math.max(w, 700) * 0.9;
    const camY = 190 + pointer.y * 40;
    const yaw = pointer.x * 0.22;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const horizon = h * 0.38;
    // Point on the terrain the pointer is "looking at"
    const focusX = pointer.x * 520;
    const focusZ = 420 + (1 - (pointer.y + 1) / 2) * 500;

    for (let r = ROWS - 1; r >= 0; r--) {
      const z0 = 80 + r * SPACING;
      for (let c = 0; c < COLS; c++) {
        const x0 = (c - COLS / 2) * SPACING;
        const d = Math.hypot(x0 - focusX, z0 - focusZ);
        const ripple = Math.exp(-d / 260) * pointer.active;
        const y0 =
          Math.sin(x0 * 0.008 + t * 0.9) * 26 +
          Math.cos(z0 * 0.011 - t * 0.7) * 22 +
          Math.sin((x0 + z0) * 0.005 + t * 0.5) * 30 +
          Math.sin(d * 0.045 - t * 4) * 34 * ripple;

        // Rotate around Y then project
        const x = x0 * cosY - z0 * sinY;
        const z = x0 * sinY + z0 * cosY;
        if (z < 40) continue;
        const scale = fov / z;
        const sx = w / 2 + x * scale;
        const sy = horizon + (camY - y0) * scale * 0.55;
        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;

        const depth = 1 - r / ROWS;
        const lift = (y0 + 80) / 160;
        const size = Math.max(0.6, scale * 1.5);
        const alpha = Math.min(0.9, depth * (0.12 + lift * 0.35) + ripple * 0.6);
        ctx.fillStyle = `rgb(${ripple > 0.25 ? accent : color} / ${alpha})`;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
    }
  }

  function loop(time: number) {
    draw(time);
    raf = requestAnimationFrame(loop);
  }

  function setRunning(on: boolean) {
    if (!animate || on === running) return;
    running = on;
    if (on) raf = requestAnimationFrame(loop);
    else cancelAnimationFrame(raf);
  }

  readColors();
  resize();
  new ResizeObserver(resize).observe(canvas);
  window.addEventListener("themechange", () => {
    readColors();
    if (!running) draw(4000);
  });

  if (!animate) return;

  const section = canvas.closest("section")!;
  section.addEventListener("pointermove", (e) => {
    const rect = section.getBoundingClientRect();
    pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.tActive = 1;
  });
  section.addEventListener("pointerleave", () => {
    pointer.tActive = 0;
    pointer.tx = pointer.ty = 0;
  });

  // Only burn frames while the hero is on screen and the tab is visible.
  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    setRunning(visible && !document.hidden);
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => setRunning(visible && !document.hidden));
}
