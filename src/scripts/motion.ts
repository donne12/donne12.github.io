import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { startHeroCanvas } from "./hero-grid";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText);

const root = document.documentElement;
const motion = root.classList.contains("js-motion");
const finePointer = matchMedia("(pointer: fine)").matches;
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(sel),
];

startHeroCanvas(document.getElementById("hero-canvas") as HTMLCanvasElement, motion);

if (motion) {
  heroIntro();
  heroScroll();
  if (finePointer) {
    magnetic();
  }
  // Everything below the fold is set up in separate idle slices so the first paint isn't held
  // up by one long task; the titles wait for the fonts (SplitText would otherwise split twice).
  idle(sections)
    .then(() => idle(marquee))
    .then(() => document.fonts.ready)
    .then(() => $$(".section-title").reduce((done, title) => done.then(() => idle(() => splitTitle(title))), Promise.resolve()))
    .catch(() => root.classList.remove("js-motion"));
}

function idle(fn: () => void) {
  return new Promise<void>((resolve, reject) => {
    const run = () => {
      try {
        fn();
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    // Safari has no requestIdleCallback.
    if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 500 });
    else setTimeout(run, 16);
  });
}
// Set last: if anything above throws, the fallback in Base.astro un-hides the content.
(window as any).__motionReady = true;


// Infinite stack bands; scroll velocity speeds them up and flips direction.
function marquee() {
  $$("[data-marquee]").forEach((row) => {
    const dir = Number(row.dataset.marquee);
    const tween = gsap.fromTo(
      row,
      { xPercent: dir > 0 ? 0 : -50 },
      { xPercent: dir > 0 ? -50 : 0, duration: 40, ease: "none", repeat: -1 },
    );
    // Scrolling up plays it backwards: start far from time 0, otherwise it reaches the
    // start and stops for good.
    tween.totalTime(tween.duration() * 1000);
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
function splitTitle(title: HTMLElement) {
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

  tl.fromTo("[data-code-card]", { y: 40, opacity: 0, rotate: -4 }, { y: 0, opacity: 1, rotate: 0, duration: 0.8, ease: "expo.out" }, 0.5)
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
