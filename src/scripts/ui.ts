// Non-animated UI behaviour: theme, language switcher, menus, scroll state.

const root = document.documentElement;

// Always land on the hero, also when the page comes back from the back/forward cache.
window.scrollTo(0, 0);
window.addEventListener("pageshow", (e) => e.persisted && window.scrollTo(0, 0));
const nav = document.getElementById("site-nav")!;

// Theme toggle
const themeBtn = document.getElementById("theme-toggle")!;
function syncThemeButton() {
  const dark = root.dataset.theme !== "light";
  const label = dark ? nav.dataset.lightLabel! : nav.dataset.darkLabel!;
  themeBtn.setAttribute("aria-label", label);
  themeBtn.setAttribute("title", label);
  themeBtn.querySelector(".theme-icon-sun")?.classList.toggle("hidden", !dark);
  themeBtn.querySelector(".theme-icon-moon")?.classList.toggle("hidden", dark);
}
themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try {
    localStorage.setItem("site-theme", next);
  } catch {}
  syncThemeButton();
  window.dispatchEvent(new CustomEvent("themechange"));
});
syncThemeButton();

// Language switcher: remember the explicit choice so "/" doesn't redirect it away.
const langSwitcher = document.getElementById("lang-switcher")!;
const langBtn = langSwitcher.querySelector("button")!;
const langList = langSwitcher.querySelector("ul")!;
function setLangOpen(open: boolean) {
  langList.toggleAttribute("data-open", open);
  langBtn.setAttribute("aria-expanded", String(open));
}
langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setLangOpen(!langList.hasAttribute("data-open"));
});
document.addEventListener("click", () => setLangOpen(false));
langList.querySelectorAll<HTMLAnchorElement>("[data-lang]").forEach((a) => {
  a.addEventListener("click", () => {
    try {
      localStorage.setItem("site-lang", a.dataset.lang!);
    } catch {}
    a.href += location.hash;
  });
});

// Mobile menu
const menuBtn = document.getElementById("menu-toggle")!;
const menu = document.getElementById("mobile-menu")!;
function setMenuOpen(open: boolean) {
  menu.toggleAttribute("data-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}
const menuIsOpen = () => menu.hasAttribute("data-open");
menuBtn.addEventListener("click", () => setMenuOpen(!menuIsOpen()));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenuOpen(false)));
// The menu is hidden from lg up: don't leave the page scroll-locked after a rotation/resize.
matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && menuIsOpen() && setMenuOpen(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Only touch the scroll lock if the menu owns it (the doc viewer uses it too).
    if (menuIsOpen()) setMenuOpen(false);
    setLangOpen(false);
  }
});

// Glass navbar once past the hero, back-to-top button, active nav link
const backToTop = document.getElementById("back-to-top")!;
function onScroll() {
  const scrolled = window.scrollY > 40;
  nav.toggleAttribute("data-scrolled", scrolled);
  backToTop.toggleAttribute("data-show", window.scrollY > 400);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const navLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")];
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((l) => l.toggleAttribute("data-active", l.hash === `#${entry.target.id}`));
    }
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
navLinks.forEach((l) => {
  const section = document.querySelector(l.hash);
  if (section) observer.observe(section);
});
