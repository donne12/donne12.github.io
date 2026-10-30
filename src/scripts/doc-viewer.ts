import { gsap } from "gsap";

// Opens `a[data-doc]` links in the side panel. Google Drive "view" links are
// swapped for their embeddable "preview" variant; links with `data-doc-view="certs"`
// show the built-in certifications gallery instead of a document.

const viewer = document.getElementById("doc-viewer")!;
const panel = viewer.querySelector<HTMLElement>("[data-doc-panel]")!;
const backdrop = viewer.querySelector<HTMLElement>("[data-doc-backdrop]")!;
const frame = viewer.querySelector<HTMLIFrameElement>("[data-doc-frame]")!;
const loading = viewer.querySelector<HTMLElement>("[data-doc-loading]")!;
const title = viewer.querySelector<HTMLElement>("#doc-title")!;
const external = viewer.querySelector<HTMLAnchorElement>("[data-doc-external]")!;
const closeBtn = viewer.querySelector<HTMLButtonElement>("[data-doc-close]")!;
const certs = viewer.querySelector<HTMLElement>("[data-doc-certs]")!;
const download = certs.querySelector<HTMLAnchorElement>("[data-certs-download]")!;
const lightbox = certs.querySelector<HTMLElement>("[data-cert-lightbox]")!;
const cards = [...certs.querySelectorAll<HTMLButtonElement>("[data-cert]")];
const lb = {
  img: lightbox.querySelector<HTMLImageElement>("[data-cert-img]")!,
  title: lightbox.querySelector<HTMLElement>("[data-cert-title]")!,
  issuer: lightbox.querySelector<HTMLElement>("[data-cert-issuer]")!,
  date: lightbox.querySelector<HTMLElement>("[data-cert-date]")!,
  note: lightbox.querySelector<HTMLElement>("[data-cert-note]")!,
  verify: lightbox.querySelector<HTMLAnchorElement>("[data-cert-verify]")!,
  count: lightbox.querySelector<HTMLElement>("[data-cert-count]")!,
};
let current = -1;
const reduced = !document.documentElement.classList.contains("js-motion");
const mobile = () => !matchMedia("(min-width: 640px)").matches;
let lastFocus: HTMLElement | null = null;
let isOpen = false;

function embedUrl(href: string) {
  const drive = href.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return drive ? `https://drive.google.com/file/d/${drive[1]}/preview` : href;
}

function showCert(i: number) {
  current = (i + cards.length) % cards.length;
  const d = cards[current].dataset;
  lb.img.src = d.full!;
  lb.img.alt = d.title!;
  lb.title.textContent = d.title!;
  lb.issuer.textContent = d.issuer!;
  lb.date.textContent = d.date!;
  lb.note.textContent = d.note!;
  lb.verify.hidden = !d.url;
  lb.verify.href = d.url || "#";
  lb.count.textContent = `${current + 1} / ${cards.length}`;
  lightbox.hidden = false;
  lightbox.querySelector<HTMLElement>("div.overflow-y-auto")!.scrollTop = 0;
  // Warm the neighbours so next/previous feel instant.
  for (const n of [current + 1, current - 1]) new Image().src = cards[(n + cards.length) % cards.length].dataset.full!;
}

function hideCert() {
  lightbox.hidden = true;
  cards[current]?.focus({ preventScroll: true });
  current = -1;
}

function open(link: HTMLAnchorElement) {
  lastFocus = link;
  isOpen = true;
  title.textContent = link.dataset.doc || link.textContent!.trim();
  frame.title = title.textContent;
  external.href = link.href;
  const gallery = link.dataset.docView === "certs";
  certs.hidden = !gallery;
  frame.hidden = gallery;
  if (gallery) {
    download.href = link.href;
    certs.scrollTop = 0;
    loading.classList.add("hidden");
  } else {
    loading.classList.remove("hidden");
    frame.classList.add("opacity-0");
    frame.src = embedUrl(link.href);
  }
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
      lightbox.hidden = true;
      current = -1;
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
cards.forEach((card, i) => card.addEventListener("click", () => showCert(i)));
lightbox.querySelector("[data-cert-back]")!.addEventListener("click", hideCert);
lightbox.querySelector("[data-cert-prev]")!.addEventListener("click", () => showCert(current - 1));
lightbox.querySelector("[data-cert-next]")!.addEventListener("click", () => showCert(current + 1));
backdrop.addEventListener("click", close);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") (current !== -1 ? hideCert : close)();
  if (current !== -1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) showCert(current + (e.key === "ArrowRight" ? 1 : -1));
  // Keep keyboard focus inside the panel while it's open
  if (e.key === "Tab" && isOpen) {
    const items: HTMLElement[] = [external, closeBtn, ...panel.querySelectorAll<HTMLElement>("[data-doc-certs]:not([hidden]) :is(a[href], button), iframe:not([hidden])")].filter((el) => el.offsetParent !== null);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i === -1 || (e.shiftKey ? i === 0 : i === items.length - 1)) {
      e.preventDefault();
      items[e.shiftKey ? items.length - 1 : 0].focus();
    }
  }
});
