import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { startHeroCanvas } from "./hero-canvas";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

const root = document.documentElement;
const motion = root.classList.contains("js-motion");
const finePointer = matchMedia("(pointer: fine)").matches;
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(sel),
];

startHeroCanvas(document.getElementById("hero-canvas") as HTMLCanvasElement, motion);
(window as any).__motionReady = true;

if (motion) {
  boot().then(() => heroIntro());
  orbit();
  marquee();
  splitTitles();
  heroScroll();
  sections();
  if (finePointer) {
    magnetic();
    tilt();
    cursor();
  }
}

// Terminal boot sequence, then the two curtains split open onto the hero.
function boot(): Promise<void> {
  const el = document.getElementById("preloader");
  if (!el || root.classList.contains("no-preload")) {
    el?.remove();
    root.classList.remove("booting");
    return Promise.resolve();
  }
  document.body.style.overflow = "hidden";
  const count = el.querySelector<HTMLElement>("[data-boot-count]")!;
  const state = { v: 0 };

  return new Promise((resolve) => {
    gsap
      .timeline({
        onComplete: () => {
          el.remove();
          document.body.style.overflow = "";
          try {
            sessionStorage.setItem("booted", "1");
          } catch {}
        },
      })
      .to($$("[data-boot-line]", el), { opacity: 1, duration: 0.05, stagger: 0.12 }, 0.05)
      .to(state, {
        v: 100,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => (count.textContent = String(Math.round(state.v))),
      }, 0)
      .to(el.querySelector("[data-boot-bar]"), { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0)
      .to(el.querySelector("[data-boot]"), { opacity: 0, y: -30, duration: 0.25, ease: "power2.in" }, 0.95)
      .to(el.querySelectorAll("[data-curtain]"), {
        yPercent: (i) => (i ? 100 : -100),
        duration: 0.75,
        ease: "expo.inOut",
      }, 1.05)
      .add(() => {
        root.classList.remove("booting");
        resolve();
      }, 1.15);
  });
}

// Dot + ring cursor that grows over interactive elements.
function cursor() {
  const el = document.getElementById("cursor")!;
  const ring = el.querySelector<HTMLElement>("[data-cursor-ring]")!;
  const dot = el.querySelector<HTMLElement>("[data-cursor-dot]")!;
  const label = el.querySelector<HTMLElement>("[data-cursor-label]")!;
  el.classList.remove("hidden");
  const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
  const dx = gsap.quickTo(dot, "x", { duration: 0.08 });
  const dy = gsap.quickTo(dot, "y", { duration: 0.08 });
  gsap.set(el, { opacity: 0 });

  window.addEventListener("pointermove", (e) => {
    gsap.to(el, { opacity: 1, duration: 0.3, overwrite: "auto" });
    rx(e.clientX);
    ry(e.clientY);
    dx(e.clientX);
    dy(e.clientY);
  });
  document.addEventListener("pointerleave", () => gsap.to(el, { opacity: 0, duration: 0.3 }));

  document.addEventListener("pointerover", (e) => {
    const target = (e.target as Element).closest("a, button, input, textarea");
    if (!target) return;
    const big = target.matches("a[data-tilt]");
    const text = target.matches("input, textarea");
    label.textContent = big ? "view" : "";
    gsap.to(ring, { scale: big ? 2.2 : text ? 0.5 : 1.6, backgroundColor: big ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)", duration: 0.35 });
    gsap.to(label, { opacity: big ? 1 : 0, color: "#000", scale: 1 / 2.2, duration: 0.25 });
    gsap.to(dot, { scale: big ? 0 : 1, duration: 0.25 });
  });
  document.addEventListener("pointerout", (e) => {
    const from = (e.target as Element).closest("a, button, input, textarea");
    const to = (e.relatedTarget as Element | null)?.closest("a, button, input, textarea");
    if (!from || from === to) return;
    gsap.to(ring, { scale: 1, backgroundColor: "rgba(255,255,255,0)", duration: 0.35 });
    gsap.to(label, { opacity: 0, duration: 0.2 });
    gsap.to(dot, { scale: 1, duration: 0.25 });
  });
  window.addEventListener("pointerdown", () => gsap.to(ring, { scale: "*=0.8", duration: 0.15, yoyo: true, repeat: 1 }));
}

// Infinite stack bands; scroll velocity speeds them up and flips direction.
function marquee() {
  $$("[data-marquee]").forEach((row) => {
    const dir = Number(row.dataset.marquee);
    const tween = gsap.fromTo(
      row,
      { xPercent: dir > 0 ? 0 : -50 },
      { xPercent: dir > 0 ? -50 : 0, duration: 40, ease: "none", repeat: -1 },
    );
    let boost = gsap.to(tween, { timeScale: 1, duration: 0.1 });
    ScrollTrigger.create({
      trigger: row,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 250);
        boost.kill();
        tween.timeScale(v || 1);
        boost = gsap.to(tween, { timeScale: self.direction, duration: 1.2, ease: "power2.out" });
      },
    });
  });
}

// Section titles rise in character by character from behind a line mask.
function splitTitles() {
  $$(".section-title").forEach((title) => {
    let played = false;
    // autoSplit re-splits on resize / font load so lines always match the layout.
    SplitText.create(title, {
      type: "lines,chars",
      mask: "lines",
      autoSplit: true,
      onSplit: (split) => {
        if (played) return;
        return gsap.from(split.chars, {
          yPercent: 110,
          rotate: 6,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.018,
          scrollTrigger: { trigger: title, start: "top 85%", once: true },
          onComplete: () => (played = true),
        });
      },
    });
  });
}

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Photo, badges and buttons fade in through CSS (see global.css); JS adds the rest.

  $$("[data-scramble]").forEach((el, i) => {
    const text = el.textContent!.trim();
    tl.set(el, { opacity: 1 }, 0.1 + i * 0.12).to(
      el,
      { duration: 0.8, scrambleText: { text, chars: "01<>/{}[]#$_*+=", revealDelay: 0.05, speed: 1 }, ease: "none" },
      0.1 + i * 0.12,
    );
  });

  // Terminal-style typing for the role line
  const typed = document.querySelector<HTMLElement>("[data-typed]");
  if (typed) {
    const full = typed.dataset.typed!;
    const state = { n: 0 };
    typed.textContent = "";
    typed.style.visibility = "visible";
    tl.to(state, {
      n: full.length,
      duration: full.length * 0.025,
      ease: "none",
      onUpdate: () => (typed.textContent = full.slice(0, Math.round(state.n))),
    }, 0.5);
  }

  tl.fromTo("[data-orbit]", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.4)
    .fromTo("[data-code-card]", { y: 40, opacity: 0, rotate: -4 }, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: "expo.out" }, 0.5)
    .fromTo(
      "[data-code-line]",
      { opacity: 0, x: -8, clipPath: "inset(0 100% 0 0)" },
      { opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.35, stagger: 0.07, ease: "power2.out" },
      0.65,
    );

  // Ambient glow drift
  $$("[data-hero-glow]").forEach((el, i) => {
    gsap.to(el, {
      x: i ? -80 : 90,
      y: i ? -60 : 70,
      scale: 1.15,
      duration: 9 + i * 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

// Tech chips circling the portrait on a tilted ellipse, passing behind it.
function orbit() {
  const wrap = document.querySelector<HTMLElement>("[data-orbit]");
  if (!wrap) return;
  const chips = $$("[data-orbit-chip]", wrap);
  let angle = 0;
  let speed = 0.25;
  wrap.parentElement!.addEventListener("pointerenter", () => (speed = 0.08));
  wrap.parentElement!.addEventListener("pointerleave", () => (speed = 0.25));

  gsap.ticker.add((_t, delta) => {
    angle += (speed * delta) / 1000;
    const r = wrap.clientWidth / 2;
    chips.forEach((chip, i) => {
      const a = angle + (i / chips.length) * Math.PI * 2;
      const depth = Math.sin(a); // -1 back, 1 front
      gsap.set(chip, {
        xPercent: -50,
        yPercent: -50,
        x: Math.cos(a) * r * 0.98,
        y: depth * r * 0.32 - Math.cos(a) * r * 0.12,
        scale: 0.78 + (depth + 1) * 0.14,
        zIndex: depth > 0 ? 15 : 5,
        opacity: 0.45 + (depth + 1) * 0.275,
        filter: `blur(${depth < -0.3 ? 1.2 : 0}px)`,
      });
    });
  });
}

function heroScroll() {
  const hero = document.getElementById("top")!;
  const scrub = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to("[data-hero-content] > :first-child", { y: -120, opacity: 0.1, ease: "none", scrollTrigger: scrub });
  gsap.to("[data-hero-visual]", { y: -60, scale: 0.92, ease: "none", scrollTrigger: scrub });
}

function sections() {
  gsap.to("#scroll-progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  gsap.set("[data-reveal]", { y: 36 });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
  });

  $$("[data-bar]").forEach((bar) => {
    gsap.from(bar, {
      scaleX: 0,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: bar, start: "top 92%", once: true },
    });
  });

  $$("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const state = { v: 0 };
    gsap.to(state, {
      v: end,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => (el.textContent = `${Math.round(state.v)}%`),
    });
  });

  $$("[data-timeline]").forEach((tl) => {
    gsap.fromTo(
      tl.querySelector("[data-timeline-progress]"),
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 70%", scrub: 0.4 } },
    );
  });
}

function magnetic() {
  $$("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener("pointerleave", () => {
      x(0);
      y(0);
    });
  });
}

function tilt() {
  $$("[data-tilt]").forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    el.addEventListener("pointerleave", () => {
      rx(0);
      ry(0);
    });
  });
}
