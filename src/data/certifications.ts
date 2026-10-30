// Certificates shown in the "Certifications" side panel. Images live in public/docs/certs
// (`<id>.webp` full size, `<id>-thumb.webp` for the grid). Spanish falls back to English.
import type { Lang } from "../i18n/utils";

type Text = { fr: string; en: string };

export const certCategories = {
  lang: { fr: "Langues", en: "Languages", es: "Idiomas" },
  dev: { fr: "Développement & automatisation", en: "Development & automation", es: "Desarrollo y automatización" },
  sec: { fr: "Cybersécurité", en: "Cybersecurity", es: "Ciberseguridad" },
  mkt: { fr: "Marketing digital", en: "Digital marketing", es: "Marketing digital" },
} as const;

export interface Cert {
  id: string;
  category: keyof typeof certCategories;
  title: Text;
  issuer: string;
  date: string; // ISO
  note: Text;
  url?: string;
  badge?: string;
  landscape?: boolean;
}

export const certifications: Cert[] = [
  {
    id: "ef-set", category: "lang", badge: "C2", issuer: "EF Education First", date: "2025-03-09",
    title: { fr: "EF SET English Certificate", en: "EF SET English Certificate" },
    note: { fr: "Score 81/100 : niveau C2 (maîtrise) du CECR. Lecture 87, écoute 74.", en: "Score 81/100: CEFR C2 (proficient). Reading 87, listening 74." },
    url: "https://cert.efset.org/fr/WfMxPM",
  },
  {
    id: "bright-language", category: "lang", badge: "C1+", issuer: "Bright Language · BNP Paribas", date: "2025-03-24",
    title: { fr: "Test d'anglais Bright Language", en: "Bright Language English test" },
    note: { fr: "English 140 General : 4,5/5, niveau C1+ du CECR. Écrit 77/80, oral 53/60.", en: "English 140 General: 4.5/5, CEFR C1+. Written 77/80, oral 53/60." },
  },
  {
    id: "uipath-rpa", category: "dev", landscape: true, issuer: "UiPath Academy", date: "2023-11-07",
    title: { fr: "RPA Developer Foundation", en: "RPA Developer Foundation" },
    note: { fr: "Parcours développeur RPA : automatisation de processus avec UiPath Studio.", en: "RPA developer learning path: process automation with UiPath Studio." },
  },
  {
    id: "udemy-flutter", category: "dev", landscape: true, issuer: "Udemy · Academind", date: "2022-12-13",
    title: { fr: "Flutter & Dart – The Complete Guide", en: "Flutter & Dart – The Complete Guide" },
    note: { fr: "42,5 heures de développement mobile multiplateforme avec Flutter et Dart.", en: "42.5 hours of cross-platform mobile development with Flutter and Dart." },
    url: "https://ude.my/UC-a00e8a36-b373-4c19-8a71-409d10b4f644",
  },
  {
    id: "sololearn-python", category: "dev", landscape: true, issuer: "SoloLearn", date: "2020-09-21",
    title: { fr: "Python 3 Tutorial", en: "Python 3 Tutorial" },
    note: { fr: "Certificat n° 1073-19825186.", en: "Certificate #1073-19825186." },
  },
  {
    id: "sololearn-javascript", category: "dev", landscape: true, issuer: "SoloLearn", date: "2020-09-20",
    title: { fr: "JavaScript Tutorial", en: "JavaScript Tutorial" },
    note: { fr: "Certificat n° 1024-19825186.", en: "Certificate #1024-19825186." },
  },
  {
    id: "bitdegree-web-design", category: "dev", landscape: true, issuer: "BitDegree · LearnToProgram", date: "2020-09-20",
    title: { fr: "Conception web : le guide ultime pour les codeurs", en: "Web design: the ultimate guide for coders" },
    note: { fr: "Certificat ID-2973246.", en: "Certificate ID-2973246." },
  },
  {
    id: "bitdegree-linux", category: "dev", landscape: true, issuer: "BitDegree · Jason Cannon", date: "2020-09-20",
    title: { fr: "Tutoriel Linux pour les nuls", en: "Linux for beginners" },
    note: { fr: "Certificat ID-2973332.", en: "Certificate ID-2973332." },
  },
  {
    id: "bitdegree-unity", category: "dev", landscape: true, issuer: "BitDegree · Yohann Taieb", date: "2020-09-20",
    title: { fr: "Tutoriel Unity : créer son monde rapidement", en: "Unity tutorial: build your world fast" },
    note: { fr: "Certificat ID-2973330.", en: "Certificate ID-2973330." },
  },
  {
    id: "bitdegree-unity-games", category: "dev", landscape: true, issuer: "BitDegree · Yohann Taieb", date: "2020-09-20",
    title: { fr: "Académie du jeu vidéo : développer des jeux Unity", en: "Video game academy: build Unity games" },
    note: { fr: "Certificat ID-2973224.", en: "Certificate ID-2973224." },
  },
  {
    id: "cybrary-pentest", category: "sec", landscape: true, issuer: "Cybrary", date: "2021-03-30",
    title: { fr: "Welcome to the Penetration Tester Career Path", en: "Welcome to the Penetration Tester Career Path" },
    note: { fr: "Introduction au parcours de pentester.", en: "Introduction to the penetration tester career path." },
  },
  {
    id: "google-marketing", category: "mkt", landscape: true, issuer: "Google Ateliers Numériques", date: "2021-06-29",
    title: { fr: "Fondamentaux du marketing numérique", en: "Fundamentals of Digital Marketing" },
    note: { fr: "Examen accrédité par l'IAB Europe et The Open University.", en: "Exam accredited by IAB Europe and The Open University." },
    url: "https://learndigital.withgoogle.com/link/1qh2gjrod8g",
  },
];

export const certDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang, { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso + "T12:00:00Z"));

export const certText = (t: Text, lang: Lang) => (lang === "fr" ? t.fr : t.en);
