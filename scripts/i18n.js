(function () {
  "use strict";

  var STORAGE_KEY = "site-lang";
  var SUPPORTED_LANGS = ["fr", "en", "es"];
  var DEFAULT_LANG = "fr";
  var currentLang = DEFAULT_LANG;

  var CV_LINKS = {
    fr: "https://drive.google.com/file/d/1un9lW2BJJqsFE6DPHbQbOLWThC74he8a/view?usp=sharing",
    en: "https://drive.google.com/file/d/1KX-3aag8Ys9l3bxCXHmz9N6Rkzls3UPB/view?usp=sharing",
    es: "https://drive.google.com/file/d/1un9lW2BJJqsFE6DPHbQbOLWThC74he8a/view?usp=sharing",
  };

  var translations = {
    fr: {
      "nav.brand": "Accueil",
      "nav.about": "Qui suis-je?",
      "nav.skills": "Tech Stack",
      "nav.portfolio": "Mes réalisations",
      "nav.experience": "Expériences",
      "nav.formation": "Formations",
      "nav.contact": "Contactez-moi",

      "hero.role": "Développeur fullstack web/mobile",
      "hero.cv_button": "Consulter mon CV",

      "social.facebook": "Suivez-moi sur Facebook",
      "social.twitter": "Suivez-moi sur Twitter",
      "social.linkedin": "Suivez-moi sur Linkedin",
      "social.instagram": "Suivez-moi sur Instagram",
      "social.github": "Suivez-moi sur Github",

      "about.bio_title": "Biographie",
      "about.bio_p1":
        "Analyste développeur et Data enthusiast passionné par l'innovation technologique. Fort d'une expérience significative en développement logiciel et gestion de projets, je m'efforce constamment d'élargir mes compétences pour relever les défis technologiques actuels.",
      "about.bio_p2":
        "Mon parcours est marqué par la réussite de plusieurs projets informatiques d'envergure et une collaboration efficace au sein d'équipes multidisciplinaires. Toujours en quête de nouveaux défis, je cherche à appliquer mon expertise pour créer des solutions innovantes et impactantes.",
      "about.info_title": "Informations de base",
      "about.label_email": "E-mail",
      "about.label_phone": "Téléphone",
      "about.label_address": "Adresse",
      "about.value_address": "Paris, France",
      "about.label_languages": "Langues",
      "about.value_languages": "Français, Anglais, Espagnol, Ewé",

      "skills.title": "Compétences professionnelles",
      "skills.frontend": "Développement Frontend",
      "skills.backend": "Développement Backend",
      "skills.mobile": "Application Mobile",
      "skills.database": "Base de données & Cloud",
      "skills.tools": "Outils & DevOps",
      "skills.design": "Design",

      "portfolio.title": "Quelques réalisations",
      "portfolio.cat_saas": "SaaS pour borne de commandes",
      "portfolio.cat_web": "Application Web",
      "portfolio.cat_mobile": "Application mobile",
      "portfolio.view_project": "Voir le projet",
      "portfolio.certifications_button": "Voir certaines de mes certifications",

      "experience.title": "Expériences professionnelles",

      "exp.bnp.date": "Décembre 2025 – aujourd'hui",
      "exp.bnp.title": "Graduate Analyst",
      "exp.bnp.desc":
        "<strong>Asset and Liability Management & Treasury - IT</strong><br>Développement et maintenance d'outils internes pour soutenir les opérations de front-office et la prise de décision des trésoriers.",

      "exp.carrefour.date": "Juillet 2023 – Juillet 2025",
      "exp.carrefour.title": "Analyste développeur RPA",
      "exp.carrefour.company": "Groupe Carrefour",
      "exp.carrefour.desc":
        "<strong>Département Automatisation & Robotisation - Digital Factory Finance & Corporate - D.S.I</strong><br>- Analyse des processus métier pour identifier les opportunités d'automatisation<br>- Développement de robots RPA conformes aux spécifications (Finance, RH, Supply Chain)<br>- Réalisation des tests avant déploiement en production<br>- Support des RPA en production<br>- Mise en place d'une application web pour le support de production et lancement/suivi des robots en autonomie",

      "exp.voscours.date": "Mars 2023 – aujourd'hui",
      "exp.voscours.title": "Professeur particulier d'informatique",
      "exp.voscours.desc":
        "Accompagnement d'étudiants et professionnels dans l'apprentissage des technologies numériques. Portefeuille de 10 à 15 étudiants réguliers.<br><strong>Enseignements :</strong> Développement web (HTML, CSS, JavaScript), algorithmique, langages (Java, Python, C#), frameworks (Flutter, Symfony, Angular, Next.js), méthodologies (MERISE, UML).<br><strong>Approche :</strong> Pédagogie personnalisée avec projets pratiques, accompagnement de reconversions professionnelles.",

      "exp.nematech.date": "Janvier 2021 – Juin 2025",
      "exp.nematech.title": "Développeur fullstack Web/Mobile",
      "exp.nematech.desc":
        "Conception et développement de solutions numériques innovantes en tant que développeur fullstack.<br>- Développement d'applications web responsives (frontend & backend)<br>- Création d'applications mobiles multiplateformes<br>- Conception et optimisation de bases de données<br>- Intégration d'APIs et services web<br>- Collaboration étroite avec l'équipe technique et les clients",

      "exp.isychain.date": "Janvier 2023 – Juin 2023",
      "exp.isychain.title": "Développeur mobile Flutter",
      "exp.isychain.company": "IsyChain - Casablanca, Maroc (Télétravail)",
      "exp.isychain.desc":
        "<strong>Projet IsyPay</strong> - Application de transfert d'argent avec blockchain<br>- Architecture et développement avec Flutter<br>- Intégration des APIs blockchain et services de paiement<br>- Conception base de données PostgreSQL<br>- Implémentation protocoles sécurité FinTech (Biométrie, 2FA)<br>- Déploiement et suivi des performances",

      "exp.protech.date": "Mai 2022 – Août 2022",
      "exp.protech.title": "Développeur web",
      "exp.protech.desc":
        "Conception d'une application de gestion de maintenance assistée par ordinateur (PRO-GMAO) pour TOGOCOM, l'une des entreprises de téléphonie les plus reconnues au Togo.",

      "exp.spark.date": "Nov 2021 - Fév 2022",
      "exp.spark.title": "Développeur mobile",
      "exp.spark.desc":
        "Conception et déploiement d'applications mobiles Android et iOS. Travail principal sur la plateforme Centralresource.",

      "exp.herpa.date": "Avril 2021 - Nov 2021",
      "exp.herpa.title": "Développeur applications mobiles",
      "exp.herpa.desc":
        "Conception de l'application mobile SUNU Santé pour le groupe SUNU, dédiée à la gestion de contrat d'assurance.<br>- Envoi de justificatifs en quelques clics via photographie<br>- Interface intuitive pour gérer toute son assurance depuis le smartphone<br>- Développement et maintenance de l'application",

      "formation.title": "Formations",

      "edu.mba.title": "MBA Développeur Fullstack",
      "edu.mba.desc":
        "<strong>Manager de projet digital, Titre RNCP Niveau 7 (BAC+5)</strong><br>Le manager de projet web digital définit une stratégie et négocie le développement des projets avec le service communication marketing de son entreprise ou sur demande de commanditaires externes.<br>",
      "edu.mba.link": "Voir le référentiel",

      "edu.licence_fr.title": "Licence Informatique",
      "edu.licence_fr.desc":
        "<strong>Sciences, Technologies, Santé mention Informatique</strong><br>Formation approfondie en informatique théorique et pratique.",

      "edu.licence_togo.title": "Licence Professionnelle",
      "edu.licence_togo.desc":
        "<strong>Génie Logiciel et Systèmes d'Informations</strong><br>Conception et développement de logiciels, gestion de bases de données et systèmes d'information.",

      "edu.bac.title": "BAC II Scientifique",
      "edu.bac.desc":
        "<strong>Série Sciences-Mathématiques (C4)</strong><br>Formation scientifique générale avec une forte composante en mathématiques et physique.",

      "contact.form_intro": "Besoin d'aide? Laissez moi un message.",
      "contact.placeholder_name": "Nom & prénoms",
      "contact.placeholder_subject": "Objet",
      "contact.placeholder_email": "Votre adresse mail",
      "contact.placeholder_message": "Votre Message",
      "contact.submit_button": "Envoyer le message",
      "contact.whatsapp_button": "Me contacter sur Whatsapp",

      "footer.rights": "Tous droits réservés.",
      "footer.credit": "Design & Code with",
      "footer.by": "by",
      "footer.back_to_top": "Retour en haut",

      "theme.enable_dark": "Activer le mode sombre",
      "theme.enable_light": "Activer le mode clair",
    },

    en: {
      "nav.brand": "Home",
      "nav.about": "About me",
      "nav.skills": "Tech Stack",
      "nav.portfolio": "Portfolio",
      "nav.experience": "Experience",
      "nav.formation": "Education",
      "nav.contact": "Contact me",

      "hero.role": "Fullstack Web/Mobile Developer",
      "hero.cv_button": "View my resume",

      "social.facebook": "Follow me on Facebook",
      "social.twitter": "Follow me on Twitter",
      "social.linkedin": "Follow me on LinkedIn",
      "social.instagram": "Follow me on Instagram",
      "social.github": "Follow me on Github",

      "about.bio_title": "Biography",
      "about.bio_p1":
        "Developer analyst and data enthusiast passionate about technological innovation. With significant experience in software development and project management, I constantly strive to expand my skills to meet today's technological challenges.",
      "about.bio_p2":
        "My career is marked by the successful delivery of several large-scale IT projects and effective collaboration within multidisciplinary teams. Always seeking new challenges, I aim to apply my expertise to create innovative and impactful solutions.",
      "about.info_title": "Basic Information",
      "about.label_email": "E-mail",
      "about.label_phone": "Phone",
      "about.label_address": "Address",
      "about.value_address": "Paris, France",
      "about.label_languages": "Languages",
      "about.value_languages": "French, English, Spanish, Ewe",

      "skills.title": "Professional Skills",
      "skills.frontend": "Frontend Development",
      "skills.backend": "Backend Development",
      "skills.mobile": "Mobile App",
      "skills.database": "Database & Cloud",
      "skills.tools": "Tools & DevOps",
      "skills.design": "Design",

      "portfolio.title": "A few of my projects",
      "portfolio.cat_saas": "SaaS for ordering kiosks",
      "portfolio.cat_web": "Web Application",
      "portfolio.cat_mobile": "Mobile Application",
      "portfolio.view_project": "View project",
      "portfolio.certifications_button": "See some of my certifications",

      "experience.title": "Professional Experience",

      "exp.bnp.date": "December 2025 – present",
      "exp.bnp.title": "Graduate Analyst",
      "exp.bnp.desc":
        "<strong>Asset and Liability Management & Treasury - IT</strong><br>Development and maintenance of internal tools to support front-office operations and treasurers' decision-making.",

      "exp.carrefour.date": "July 2023 – July 2025",
      "exp.carrefour.title": "RPA Developer Analyst",
      "exp.carrefour.company": "Carrefour Group",
      "exp.carrefour.desc":
        "<strong>Automation & Robotics Department - Digital Factory Finance & Corporate - IT Department</strong><br>- Business process analysis to identify automation opportunities<br>- Development of RPA robots according to specifications (Finance, HR, Supply Chain)<br>- Testing before production deployment<br>- Production support for RPA robots<br>- Set up a web application for production support and autonomous robot launch/monitoring",

      "exp.voscours.date": "March 2023 – present",
      "exp.voscours.title": "Private Computer Science Tutor",
      "exp.voscours.desc":
        "Supporting students and professionals in learning digital technologies. Portfolio of 10 to 15 regular students.<br><strong>Subjects taught:</strong> Web development (HTML, CSS, JavaScript), algorithms, languages (Java, Python, C#), frameworks (Flutter, Symfony, Angular, Next.js), methodologies (MERISE, UML).<br><strong>Approach:</strong> Personalized teaching with hands-on projects, support for career changers.",

      "exp.nematech.date": "January 2021 – June 2025",
      "exp.nematech.title": "Fullstack Web/Mobile Developer",
      "exp.nematech.desc":
        "Design and development of innovative digital solutions as a fullstack developer.<br>- Development of responsive web applications (frontend & backend)<br>- Creation of cross-platform mobile applications<br>- Database design and optimization<br>- API and web services integration<br>- Close collaboration with the technical team and clients",

      "exp.isychain.date": "January 2023 – June 2023",
      "exp.isychain.title": "Flutter Mobile Developer",
      "exp.isychain.company": "IsyChain - Casablanca, Morocco (Remote)",
      "exp.isychain.desc":
        "<strong>IsyPay Project</strong> - Blockchain money transfer application<br>- Architecture and development with Flutter<br>- Integration of blockchain APIs and payment services<br>- PostgreSQL database design<br>- Implementation of FinTech security protocols (Biometrics, 2FA)<br>- Deployment and performance monitoring",

      "exp.protech.date": "May 2022 – August 2022",
      "exp.protech.title": "Web Developer",
      "exp.protech.desc":
        "Design of a computer-assisted maintenance management application (PRO-GMAO) for TOGOCOM, one of the most recognized telecom companies in Togo.",

      "exp.spark.date": "Nov 2021 - Feb 2022",
      "exp.spark.title": "Mobile Developer",
      "exp.spark.desc":
        "Design and deployment of Android and iOS mobile applications. Main work on the Centralresource platform.",

      "exp.herpa.date": "April 2021 - Nov 2021",
      "exp.herpa.title": "Mobile App Developer",
      "exp.herpa.desc":
        "Design of the SUNU Santé mobile application for the SUNU group, dedicated to insurance policy management.<br>- Submitting supporting documents in a few clicks via photo<br>- Intuitive interface to manage all insurance from a smartphone<br>- Development and maintenance of the application",

      "formation.title": "Education",

      "edu.mba.title": "Fullstack Developer MBA",
      "edu.mba.desc":
        "<strong>Digital Project Manager, RNCP Level 7 Certification (Master's level)</strong><br>The digital web project manager defines a strategy and negotiates project development with the marketing communications department of their company or on behalf of external clients.<br>",
      "edu.mba.link": "View the certification",

      "edu.licence_fr.title": "Bachelor's Degree in Computer Science",
      "edu.licence_fr.desc":
        "<strong>Sciences, Technology, Health - Computer Science major</strong><br>In-depth training in theoretical and practical computer science.",

      "edu.licence_togo.title": "Professional Bachelor's Degree",
      "edu.licence_togo.desc":
        "<strong>Software Engineering and Information Systems</strong><br>Design and development of software, database management and information systems.",

      "edu.bac.title": "Scientific Baccalaureate",
      "edu.bac.desc":
        "<strong>Science-Mathematics Track (C4)</strong><br>General scientific education with a strong focus on mathematics and physics.",

      "contact.form_intro": "Need help? Leave me a message.",
      "contact.placeholder_name": "Full name",
      "contact.placeholder_subject": "Subject",
      "contact.placeholder_email": "Your email address",
      "contact.placeholder_message": "Your message",
      "contact.submit_button": "Send message",
      "contact.whatsapp_button": "Contact me on WhatsApp",

      "footer.rights": "All rights reserved.",
      "footer.credit": "Design & Code with",
      "footer.by": "by",
      "footer.back_to_top": "Back to top",

      "theme.enable_dark": "Enable dark mode",
      "theme.enable_light": "Enable light mode",
    },

    es: {
      "nav.brand": "Inicio",
      "nav.about": "Sobre mí",
      "nav.skills": "Tech Stack",
      "nav.portfolio": "Mis proyectos",
      "nav.experience": "Experiencia",
      "nav.formation": "Formación",
      "nav.contact": "Contáctame",

      "hero.role": "Desarrollador fullstack web/móvil",
      "hero.cv_button": "Ver mi CV",

      "social.facebook": "Sígueme en Facebook",
      "social.twitter": "Sígueme en Twitter",
      "social.linkedin": "Sígueme en LinkedIn",
      "social.instagram": "Sígueme en Instagram",
      "social.github": "Sígueme en Github",

      "about.bio_title": "Biografía",
      "about.bio_p1":
        "Analista desarrollador y entusiasta de los datos apasionado por la innovación tecnológica. Con una experiencia significativa en desarrollo de software y gestión de proyectos, me esfuerzo constantemente por ampliar mis competencias para afrontar los retos tecnológicos actuales.",
      "about.bio_p2":
        "Mi trayectoria está marcada por el éxito de varios proyectos informáticos de gran envergadura y una colaboración eficaz dentro de equipos multidisciplinarios. Siempre en busca de nuevos retos, busco aplicar mi experiencia para crear soluciones innovadoras y de impacto.",
      "about.info_title": "Información básica",
      "about.label_email": "Correo electrónico",
      "about.label_phone": "Teléfono",
      "about.label_address": "Dirección",
      "about.value_address": "París, Francia",
      "about.label_languages": "Idiomas",
      "about.value_languages": "Francés, Inglés, Español, Ewé",

      "skills.title": "Competencias profesionales",
      "skills.frontend": "Desarrollo Frontend",
      "skills.backend": "Desarrollo Backend",
      "skills.mobile": "Aplicación Móvil",
      "skills.database": "Base de Datos y Cloud",
      "skills.tools": "Herramientas y DevOps",
      "skills.design": "Diseño",

      "portfolio.title": "Algunos de mis proyectos",
      "portfolio.cat_saas": "SaaS para quiosco de pedidos",
      "portfolio.cat_web": "Aplicación Web",
      "portfolio.cat_mobile": "Aplicación móvil",
      "portfolio.view_project": "Ver proyecto",
      "portfolio.certifications_button": "Ver algunas de mis certificaciones",

      "experience.title": "Experiencia profesional",

      "exp.bnp.date": "Diciembre 2025 – actualidad",
      "exp.bnp.title": "Graduate Analyst",
      "exp.bnp.desc":
        "<strong>Gestión de Activos y Pasivos y Tesorería - TI</strong><br>Desarrollo y mantenimiento de herramientas internas para apoyar las operaciones de front-office y la toma de decisiones de los tesoreros.",

      "exp.carrefour.date": "Julio 2023 – Julio 2025",
      "exp.carrefour.title": "Analista desarrollador RPA",
      "exp.carrefour.company": "Grupo Carrefour",
      "exp.carrefour.desc":
        "<strong>Departamento de Automatización y Robotización - Digital Factory Finance & Corporate - D.S.I</strong><br>- Análisis de procesos de negocio para identificar oportunidades de automatización<br>- Desarrollo de robots RPA conforme a las especificaciones (Finanzas, RRHH, Cadena de Suministro)<br>- Realización de pruebas antes del despliegue en producción<br>- Soporte de los RPA en producción<br>- Implementación de una aplicación web para el soporte de producción y el lanzamiento/seguimiento autónomo de los robots",

      "exp.voscours.date": "Marzo 2023 – actualidad",
      "exp.voscours.title": "Profesor particular de informática",
      "exp.voscours.desc":
        "Acompañamiento de estudiantes y profesionales en el aprendizaje de tecnologías digitales. Cartera de 10 a 15 estudiantes regulares.<br><strong>Materias impartidas:</strong> Desarrollo web (HTML, CSS, JavaScript), algoritmia, lenguajes (Java, Python, C#), frameworks (Flutter, Symfony, Angular, Next.js), metodologías (MERISE, UML).<br><strong>Enfoque:</strong> Pedagogía personalizada con proyectos prácticos, acompañamiento en reconversiones profesionales.",

      "exp.nematech.date": "Enero 2021 – Junio 2025",
      "exp.nematech.title": "Desarrollador fullstack Web/Móvil",
      "exp.nematech.desc":
        "Diseño y desarrollo de soluciones digitales innovadoras como desarrollador fullstack.<br>- Desarrollo de aplicaciones web responsivas (frontend y backend)<br>- Creación de aplicaciones móviles multiplataforma<br>- Diseño y optimización de bases de datos<br>- Integración de APIs y servicios web<br>- Colaboración estrecha con el equipo técnico y los clientes",

      "exp.isychain.date": "Enero 2023 – Junio 2023",
      "exp.isychain.title": "Desarrollador móvil Flutter",
      "exp.isychain.company": "IsyChain - Casablanca, Marruecos (Teletrabajo)",
      "exp.isychain.desc":
        "<strong>Proyecto IsyPay</strong> - Aplicación de transferencia de dinero con blockchain<br>- Arquitectura y desarrollo con Flutter<br>- Integración de APIs blockchain y servicios de pago<br>- Diseño de base de datos PostgreSQL<br>- Implementación de protocolos de seguridad FinTech (Biometría, 2FA)<br>- Despliegue y seguimiento del rendimiento",

      "exp.protech.date": "Mayo 2022 – Agosto 2022",
      "exp.protech.title": "Desarrollador web",
      "exp.protech.desc":
        "Diseño de una aplicación de gestión de mantenimiento asistida por ordenador (PRO-GMAO) para TOGOCOM, una de las empresas de telefonía más reconocidas de Togo.",

      "exp.spark.date": "Nov 2021 - Feb 2022",
      "exp.spark.title": "Desarrollador móvil",
      "exp.spark.desc":
        "Diseño y despliegue de aplicaciones móviles Android e iOS. Trabajo principal en la plataforma Centralresource.",

      "exp.herpa.date": "Abril 2021 - Nov 2021",
      "exp.herpa.title": "Desarrollador de aplicaciones móviles",
      "exp.herpa.desc":
        "Diseño de la aplicación móvil SUNU Santé para el grupo SUNU, dedicada a la gestión de contratos de seguro.<br>- Envío de justificantes en pocos clics mediante fotografía<br>- Interfaz intuitiva para gestionar todo el seguro desde el smartphone<br>- Desarrollo y mantenimiento de la aplicación",

      "formation.title": "Formación",

      "edu.mba.title": "MBA en Desarrollo Fullstack",
      "edu.mba.desc":
        "<strong>Manager de proyecto digital, Título RNCP Nivel 7 (equivalente a Máster)</strong><br>El manager de proyecto web digital define una estrategia y negocia el desarrollo de proyectos con el departamento de comunicación y marketing de su empresa o a petición de clientes externos.<br>",
      "edu.mba.link": "Ver el referencial",

      "edu.licence_fr.title": "Licenciatura en Informática",
      "edu.licence_fr.desc":
        "<strong>Ciencias, Tecnología, Salud - mención Informática</strong><br>Formación profunda en informática teórica y práctica.",

      "edu.licence_togo.title": "Licenciatura Profesional",
      "edu.licence_togo.desc":
        "<strong>Ingeniería de Software y Sistemas de Información</strong><br>Diseño y desarrollo de software, gestión de bases de datos y sistemas de información.",

      "edu.bac.title": "Bachillerato Científico",
      "edu.bac.desc":
        "<strong>Serie Ciencias-Matemáticas (C4)</strong><br>Formación científica general con un fuerte componente en matemáticas y física.",

      "contact.form_intro": "¿Necesitas ayuda? Déjame un mensaje.",
      "contact.placeholder_name": "Nombre y apellidos",
      "contact.placeholder_subject": "Asunto",
      "contact.placeholder_email": "Tu correo electrónico",
      "contact.placeholder_message": "Tu mensaje",
      "contact.submit_button": "Enviar mensaje",
      "contact.whatsapp_button": "Contáctame por WhatsApp",

      "footer.rights": "Todos los derechos reservados.",
      "footer.credit": "Diseño y código con",
      "footer.by": "por",
      "footer.back_to_top": "Volver arriba",

      "theme.enable_dark": "Activar el modo oscuro",
      "theme.enable_light": "Activar el modo claro",
    },
  };

  function detectInitialLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) {
        return saved;
      }
    } catch (e) {
      // localStorage unavailable (private mode, etc.) - ignore
    }

    var browserLang = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.indexOf(browserLang) !== -1) {
      return browserLang;
    }

    return DEFAULT_LANG;
  }

  function applyLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) {
      lang = DEFAULT_LANG;
    }

    var dict = translations[lang];
    currentLang = lang;

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (dict[key] !== undefined) {
        el.setAttribute("title", dict[key]);
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    document.querySelectorAll(".cv-link").forEach(function (el) {
      el.setAttribute("href", CV_LINKS[lang] || CV_LINKS[DEFAULT_LANG]);
    });

    var label = document.getElementById("current-lang-label");
    if (label) {
      label.textContent = lang.toUpperCase();
    }

    document.querySelectorAll(".lang-option").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang") === lang);
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore storage errors
    }

    if (window.themeManager) {
      window.themeManager.refreshTitle();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(detectInitialLang());
  });

  window.i18n = {
    setLanguage: applyLanguage,
    translations: translations,
    getLanguage: function () {
      return currentLang;
    },
  };
})();
