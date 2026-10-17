import { gsap } from "gsap";

// Opens `a[data-doc]` links in the side panel. Google Drive "view" links are
// swapped for their embeddable "preview" variant.

const viewer = document.getElementById("doc-viewer")!;
const panel = viewer.querySelector<HTMLElement>("[data-doc-panel]")!;
const backdrop = viewer.querySelector<HTMLElement>("[data-doc-backdrop]")!;
const frame = viewer.querySelector<HTMLIFrameElement>("[data-doc-frame]")!;
const loading = viewer.querySelector<HTMLElement>("[data-doc-loading]")!;
const title = viewer.querySelector<HTMLElement>("#doc-title")!;
const external = viewer.querySelector<HTMLAnchorElement>("[data-doc-external]")!;
const closeBtn = viewer.querySelector<HTMLButtonElement>("[data-doc-close]")!;
const reduced = !document.documentElement.classList.contains("js-motion");
const mobile = () => !matchMedia("(min-width: 640px)").matches;
let lastFocus: HTMLElement | null = null;
let isOpen = false;

function embedUrl(href: string) {
  const drive = href.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return drive ? `https://drive.google.com/file/d/${drive[1]}/preview` : href;
}

function open(link: HTMLAnchorElement) {
  lastFocus = link;
  isOpen = true;
  title.textContent = link.dataset.doc || link.textContent!.trim();
  frame.title = title.textContent;
  external.href = link.href;
  loading.classList.remove("hidden");
  frame.classList.add("opacity-0");
  frame.src = embedUrl(link.href);
  viewer.classList.remove("invisible");
  document.body.style.overflow = "hidden";

  const from = mobile() ? { yPercent: 100 } : { xPercent: 105 };
  gsap.killTweensOf([panel, backdrop]);
  gsap.to(backdrop, { opacity: 1, duration: reduced ? 0 : 0.4 });
  gsap.fromTo(panel, from, { xPercent: 0, yPercent: 0, duration: reduced ? 0 : 0.7, ease: "expo.out" });
  closeBtn.focus({ preventScroll: true });
}

function close() {
  if (!isOpen) return;
  isOpen = false;
  const to = mobile() ? { yPercent: 100 } : { xPercent: 105 };
  gsap.killTweensOf([panel, backdrop]);
  gsap.to(backdrop, { opacity: 0, duration: reduced ? 0 : 0.35 });
  gsap.to(panel, {
    ...to,
    duration: reduced ? 0 : 0.5,
    ease: "expo.in",
    onComplete: () => {
      viewer.classList.add("invisible");
      frame.src = "about:blank";
      document.body.style.overflow = "";
      lastFocus?.focus({ preventScroll: true });
    },
  });
}

frame.addEventListener("load", () => {
  if (frame.src === "about:blank") return;
  loading.classList.add("hidden");
  frame.classList.remove("opacity-0");
});

document.addEventListener("click", (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>("a[data-doc]");
  if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  open(link);
});
closeBtn.addEventListener("click", close);
backdrop.addEventListener("click", close);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") close();
  // Keep keyboard focus inside the panel while it's open
  if (e.key === "Tab" && isOpen) {
    const items: HTMLElement[] = [external, closeBtn, frame];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i === -1 || (e.shiftKey ? i === 0 : i === items.length - 1)) {
      e.preventDefault();
      items[e.shiftKey ? items.length - 1 : 0].focus();
    }
  }
});
