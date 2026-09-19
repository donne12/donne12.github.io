(function () {
  "use strict";

  var STORAGE_KEY = "site-theme";

  var FALLBACK_TITLES = {
    dark: "Activer le mode sombre",
    light: "Activer le mode clair",
  };

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function themeToggleTitle(nextTheme) {
    var lang = (window.i18n && window.i18n.getLanguage && window.i18n.getLanguage()) || "fr";
    var dict = (window.i18n && window.i18n.translations && window.i18n.translations[lang]) || {};
    var key = nextTheme === "dark" ? "theme.enable_dark" : "theme.enable_light";
    return dict[key] || FALLBACK_TITLES[nextTheme];
  }

  function updateToggleUI(theme, animate) {
    var icon = document.getElementById("theme-toggle-icon");
    var btn = document.getElementById("theme-toggle");
    var nextTheme = theme === "dark" ? "light" : "dark";

    if (icon) {
      icon.className = theme === "dark" ? "fa fa-sun-o" : "fa fa-moon-o";
      if (animate) {
        icon.classList.add("theme-icon-pop");
        icon.addEventListener(
          "animationend",
          function () {
            icon.classList.remove("theme-icon-pop");
          },
          { once: true }
        );
      }
    }
    if (btn) {
      btn.setAttribute("title", themeToggleTitle(nextTheme));
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  }

  function setTheme(theme, animate) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage unavailable - ignore
    }
    updateToggleUI(theme, animate);
  }

  function toggleTheme() {
    setTheme(getCurrentTheme() === "dark" ? "light" : "dark", true);
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateToggleUI(getCurrentTheme());

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTheme();
      });
    }
  });

  window.themeManager = {
    setTheme: setTheme,
    toggle: toggleTheme,
    refreshTitle: function () {
      updateToggleUI(getCurrentTheme());
    },
  };
})();
