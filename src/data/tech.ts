// Tech logos, mostly from Devicon. Sources and licences: src/assets/tech/SOURCES.md.
import type { ImageMetadata } from "astro";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/tech/*.svg", { eager: true });

export interface Tech {
  name: string;
  icon?: ImageMetadata;
  /** Dark logo that needs inverting on the dark theme */
  invert?: boolean;
}

const logo = (slug: string) => files[`../assets/tech/${slug}.svg`]?.default;

const defs: Record<string, Omit<Tech, "icon"> & { file?: string }> = {
  angular: { name: "Angular" },
  html5: { name: "HTML5" },
  css3: { name: "CSS3" },
  javascript: { name: "JavaScript" },
  typescript: { name: "TypeScript" },
  react: { name: "React" },
  nextjs: { name: "Next.js", invert: true },
  vuejs: { name: "Vue.js" },
  bootstrap: { name: "Bootstrap" },
  dotnet: { name: ".NET", file: "dotnetcore" },
  aspnet: { name: "ASP.NET Core", file: "dot-net" },
  csharp: { name: "C#" },
  nodejs: { name: "Node.js" },
  spring: { name: "Spring Boot" },
  php: { name: "PHP" },
  symfony: { name: "Symfony", invert: true },
  python: { name: "Python" },
  java: { name: "Java" },
  flutter: { name: "Flutter" },
  kotlin: { name: "Kotlin" },
  firebase: { name: "Firebase" },
  mongodb: { name: "MongoDB" },
  postgresql: { name: "PostgreSQL" },
  sqlserver: { name: "SQL Server", file: "microsoftsqlserver" },
  aws: { name: "AWS", file: "amazonwebservices", invert: true },
  gcp: { name: "Google Cloud", file: "googlecloud" },
  git: { name: "Git" },
  github: { name: "GitHub", invert: true },
  gitlab: { name: "GitLab" },
  docker: { name: "Docker" },
  jenkins: { name: "Jenkins" },
  rxjs: { name: "RxJS" },
  xd: { name: "Adobe XD" },
  lunacy: { name: "Lunacy" },
  uipath: { name: "UiPath" },
  claudecode: { name: "Claude Code" },
  codex: { name: "Codex" },
  copilot: { name: "GitHub Copilot", file: "githubcopilot", invert: true },
};

export const tech: Record<string, Tech> = Object.fromEntries(
  Object.entries(defs).map(([slug, { file, ...t }]) => [slug, { ...t, icon: logo(file ?? slug) }]),
);
