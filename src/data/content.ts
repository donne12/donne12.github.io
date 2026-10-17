// Language-independent content. Text fields hold translation keys from src/i18n/ui.ts.
import type { ImageMetadata } from "astro";

// Images live in src/assets so Astro can resize them and convert them to WebP at build time.
const images = import.meta.glob<{ default: ImageMetadata }>("../assets/images/*", { eager: true });
const img = (file: string) => images[`../assets/images/${file}`].default;

export const profile = {
  name: "Dieudonné K. A. ESIAKU",
  shortName: "Dieudonné ESIAKU",
  email: "donnesiaku@yahoo.com",
  phone: "(+33) 07 61 54 79 94",
  phoneHref: "tel:+330761547994",
  whatsapp: "https://wa.me/+33761547994",
  linkedin: "https://www.linkedin.com/in/dieudonne-esiaku/",
  github: "https://github.com/donne12",
  certifications: "https://drive.google.com/file/d/1-zMdAM-IOGFBfOTwde0BiI_lu9oG6SzY/view?usp=sharing",
  formspree: "https://formspree.io/f/xvodoqwb",
};

export const skills = [
  {
    key: "skills.frontend",
    items: [
      ["Angular", 85, ["angular"]],
      ["HTML/CSS/JS", 90, ["html5", "css3", "javascript"]],
      ["React.js/Next.js", 50, ["react", "nextjs"]],
      ["Vue.js", 70, ["vuejs"]],
      ["Bootstrap", 70, ["bootstrap"]],
    ],
  },
  {
    key: "skills.backend",
    items: [
      [".NET / C#", 85, ["dotnet", "csharp"]],
      ["Node.js/Spring Boot", 80, ["nodejs", "spring"]],
      ["PHP", 90, ["php"]],
      ["Python/Java", 75, ["python", "java"]],
    ],
  },
  {
    key: "skills.mobile",
    items: [
      ["Flutter", 85, ["flutter"]],
      ["Kotlin", 65, ["kotlin"]],
    ],
  },
  {
    key: "skills.database",
    items: [
      ["Firebase/MongoDB", 80, ["firebase", "mongodb"]],
      ["AWS/Google CP", 50, ["aws", "gcp"]],
    ],
  },
  {
    key: "skills.tools",
    items: [
      ["Git/GitHub/GitLab", 70, ["git", "github", "gitlab"]],
      ["Docker/Jenkins", 40, ["docker", "jenkins"]],
    ],
  },
  {
    key: "skills.design",
    items: [
      ["Lunacy", 60, ["lunacy"]],
      ["Adobe XD", 70, ["xd"]],
    ],
  },
] as const;

// AI coding agents, highlighted below the skill cards.
export const aiAgents = [
  { slug: "claudecode" },
  { slug: "codex" },
  { slug: "copilot" },
] as const;

export const projects = [
  { title: "My Student Companion", desc: "portfolio.d.msc", cat: "portfolio.cat_platform", img: img("mystudentcompanion.jpg"), url: "https://mystudentcompanion.com/" },
  { title: "Padel Up Togo", desc: "portfolio.d.padel", cat: "portfolio.cat_mobile", img: img("padelup.jpg"), url: "https://play.google.com/store/apps/details?id=tg.padel.up" },
  { title: "SubMeett", desc: "portfolio.d.submeet", cat: "portfolio.cat_mobile", img: img("submeet.jpg"), url: "https://play.google.com/store/apps/details?id=tg.submeet.app" },
  { title: "BorneEasy", desc: "portfolio.d.borne", cat: "portfolio.cat_saas", img: img("app2.png"), url: "https://borneasy.vercel.app" },
  { title: "Meyaku", desc: "portfolio.d.meyaku", cat: "portfolio.cat_web", img: img("app8.jpg"), url: "https://meyaku.com/" },
  { title: "Swiss Eats", desc: "portfolio.d.swiss", cat: "portfolio.cat_mobile", img: img("app1.png"), url: "https://play.google.com/store/apps/details?id=com.ch.rytmodelivery" },
  { title: "Centralresource", desc: "portfolio.d.central", cat: "portfolio.cat_web", img: img("app3.jpeg"), url: "https://centralresource.net/" },
  { title: "Leader Delivery", desc: "portfolio.d.leader", cat: "portfolio.cat_mobile", img: img("affiche1.png"), url: "https://www.leaderdelivery-togo.com" },
  { title: "SUNU Santé", desc: "portfolio.d.sunu", cat: "portfolio.cat_mobile", img: img("affiche3.png"), url: "https://sunugrouphealth.com/" },
] as const;

// `company` is either a literal name or a translation key (when it starts with "exp.").
export const experiences = [
  { id: "bnp", company: "BNP Paribas CIB", logo: img("logo-bnp.png") },
  { id: "carrefour", company: "exp.carrefour.company", logo: img("logo-carrefour.png") },
  { id: "voscours", company: "VosCours.fr", logo: img("voscours.png") },
  { id: "nematech", company: "NEMATECH GROUP", logo: img("nematech.png") },
  { id: "isychain", company: "exp.isychain.company", logo: img("isychain.png") },
  { id: "protech", company: "TOGOCOM (via PROTECH-TRI)", logo: img("yas.svg") },
  { id: "spark", company: "SPARK CORPORATION", logo: img("spark.webp") },
  { id: "herpa", company: "SUNU GROUP (via HERPA SOLUTIONS)", logo: img("sunu.png") },
] as const;

export const education = [
  { id: "mba", date: "2023 - 2025", school: "MyDigitalSchool - Caen, FRANCE", logo: img("rncp7.webp"), link: "https://www.francecompetences.fr/recherche/rncp/40363" },
  { id: "licence_fr", date: "2022 - 2023", school: "Université Caen Normandie - France", logo: img("DL_01_DNL.png") },
  { id: "licence_togo", date: "2019 - 2022", school: "Institut Africain d'Informatique - TOGO", logo: img("logo-iai.jpeg") },
  { id: "bac", date: "2016 - 2019", school: "Lycée Scientifique de Lomé - Togo", logo: img("lyceescientifique.jpg") },
] as const;

