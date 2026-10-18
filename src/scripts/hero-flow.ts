// "Flow field" behind the hero: a few hundred filaments drift along an invisible current and
// leave fading trails. The pointer pushes the current aside as it moves across the hero.

export function startHeroCanvas(canvas: HTMLCanvasElement, animate: boolean) {
  const ctx = canvas.getContext("2d")!;
  let w = 0;
  let h = 0;
  let color = "148 160 255";
  let accent = "34 211 238";
  const pointer = { x: -9999, y: -9999, active: 0, tActive: 0 };
  let running = false;
  let raf = 0;
  let t = 0;

  type P = { x: number; y: number; life: number; hue: number };
  let parts: P[] = [];

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    color = s.getPropertyValue("--dot").trim() || color;
    accent = s.getPropertyValue("--dot-accent").trim() || accent;
  }

  const spawn = (p: Partial<P> = {}): P => ({
    x: Math.random() * w,
    y: Math.random() * h,
    life: 120 + Math.random() * 260,
    hue: Math.random() < 0.28 ? 1 : 0,
    ...p,
  });

  function angle(x: number, y: number) {
    const k = 0.0016;
    return (Math.sin(x * k * 1.3 + t * 0.35) + Math.cos(y * k * 1.7 - t * 0.28) + Math.sin((x + y) * k * 0.8 + t * 0.2)) * 1.6;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(170, Math.max(50, (w * h) / 8000)));
    parts = Array.from({ length: count }, () => spawn());
    ctx.clearRect(0, 0, w, h);
    if (!running) settle();
  }

  function step(fade: boolean) {
    pointer.active += (pointer.tActive - pointer.active) * 0.08;
    if (fade) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgb(0 0 0 / 0.1)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    for (const p of parts) {
      let a = angle(p.x, p.y);
      let speed = 0.9;
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d = Math.hypot(dx, dy);
      if (pointer.active > 0.01 && d < 190) {
        const f = (1 - d / 190) * pointer.active;
        a = Math.atan2(dy, dx) * f + a * (1 - f) + f * 1.4;
        speed += f * 2.4;
      }
      const nx = p.x + Math.cos(a) * speed;
      const ny = p.y + Math.sin(a) * speed;
      const edge = Math.min(p.life / 30, 1);
      ctx.strokeStyle = `rgb(${p.hue ? accent : color} / ${0.3 * edge})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      p.x = nx;
      p.y = ny;
      p.life--;
      if (p.life <= 0 || nx < -10 || nx > w + 10 || ny < -10 || ny > h + 10) Object.assign(p, spawn());
    }
  }

  // Reduced motion / first paint: run the simulation ahead so trails are already there.
  function settle() {
    for (let i = 0; i < 90; i++) {
      t += 0.016;
      step(false);
    }
  }

  function loop() {
    t += 0.016;
    step(true);
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
    ctx.clearRect(0, 0, w, h);
    if (!running) settle();
  });

  if (!animate) return;

  const section = canvas.closest("section")!;
  section.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.tActive = 1;
  });
  section.addEventListener("pointerleave", () => (pointer.tActive = 0));

  // Only burn frames while the hero is on screen and the tab is visible.
  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    setRunning(visible && !document.hidden);
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => setRunning(visible && !document.hidden));
}
