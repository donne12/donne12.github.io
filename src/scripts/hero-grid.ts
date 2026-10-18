// "Data packets" behind the hero: short bright dashes travel along the lines of the background
// grid and turn 90° at intersections, leaving a faint straight trail. Moving the pointer sends
// a new packet out from the nearest intersection.

export function startHeroCanvas(canvas: HTMLCanvasElement, animate: boolean) {
  const ctx = canvas.getContext("2d")!;
  const CELL = 64; // matches the bg-grid utility
  let w = 0;
  let h = 0;
  let color = "148 160 255";
  let accent = "34 211 238";
  let running = false;
  let raf = 0;
  let last = 0;

  const DIRS = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ] as const;
  type P = { x: number; y: number; dir: number; speed: number; hue: number; life: number };
  let packets: P[] = [];

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    color = s.getPropertyValue("--dot").trim() || color;
    accent = s.getPropertyValue("--dot-accent").trim() || accent;
  }

  const spawn = (x?: number, y?: number): P => ({
    x: x ?? Math.round((Math.random() * w) / CELL) * CELL,
    y: y ?? Math.round((Math.random() * h) / CELL) * CELL,
    dir: (Math.random() * 4) | 0,
    speed: 55 + Math.random() * 70,
    hue: Math.random() < 0.35 ? 1 : 0,
    life: 6 + Math.random() * 8,
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    packets = Array.from({ length: w < 700 ? 14 : 30 }, () => spawn());
    ctx.clearRect(0, 0, w, h);
    if (!running) settle();
  }

  function step(dt: number, fade: boolean) {
    if (fade) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgb(0 0 0 / 0.045)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.lineWidth = 1.5;
    ctx.lineCap = "square";
    packets.forEach((p, i) => {
      const [dx, dy] = DIRS[p.dir];
      const dist = p.speed * dt;
      const nx = p.x + dx * dist;
      const ny = p.y + dy * dist;
      // Crossed an intersection? Maybe turn.
      const crossed = dx ? Math.floor(nx / CELL) !== Math.floor(p.x / CELL) : Math.floor(ny / CELL) !== Math.floor(p.y / CELL);
      const col = p.hue ? accent : color;
      // Short bright head + the fade pass leaves the trail
      ctx.strokeStyle = `rgb(${col} / 0.45)`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      p.x = nx;
      p.y = ny;
      p.life -= dt;
      if (crossed && Math.random() < 0.3) {
        p.x = dx ? Math.round(nx / CELL) * CELL : p.x;
        p.y = dy ? Math.round(ny / CELL) * CELL : p.y;
        p.dir = (p.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
      }
      if (p.life <= 0 || p.x < -CELL || p.x > w + CELL || p.y < -CELL || p.y > h + CELL) packets[i] = spawn();
    });
  }

  // First paint / reduced motion: run ahead so some trails are already on screen.
  function settle() {
    for (let i = 0; i < 90; i++) step(0.05, false);
  }

  function loop(time: number) {
    const dt = Math.min((time - last) / 1000, 0.05);
    last = time;
    step(dt, true);
    raf = requestAnimationFrame(loop);
  }

  function setRunning(on: boolean) {
    if (!animate || on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else cancelAnimationFrame(raf);
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
  let lastSpawn = 0;
  section.addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - lastSpawn < 220) return;
    lastSpawn = now;
    const rect = canvas.getBoundingClientRect();
    const p = spawn(Math.round((e.clientX - rect.left) / CELL) * CELL, Math.round((e.clientY - rect.top) / CELL) * CELL);
    p.hue = 1;
    p.life = 2.5;
    packets.push(p);
    if (packets.length > 60) packets.shift();
  });

  // Only burn frames while the hero is on screen and the tab is visible.
  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    setRunning(visible && !document.hidden);
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => setRunning(visible && !document.hidden));
}
