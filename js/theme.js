const THEME_KEY = "theme";
const themeToggle = document.getElementById("theme-toggle");

const themeLabels = {
  en: {
    toDark: "Switch to night theme",
    toLight: "Switch to day theme",
  },
  uk: {
    toDark: "Перемкнути на нічну тему",
    toLight: "Перемкнути на денну тему",
  },
};

const getPreferredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch (error) {
    // Ignore storage access errors and fall back to system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getCurrentLang = () =>
  document.documentElement.lang === "uk" ? "uk" : "en";

const updateToggle = (theme) => {
  if (!themeToggle) {
    return;
  }

  const isDark = theme === "dark";
  const labels = themeLabels[getCurrentLang()];

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? labels.toLight : labels.toDark
  );
};

const applyTheme = (theme, persist = false) => {
  document.documentElement.setAttribute("data-theme", theme);
  updateToggle(theme);

  if (!persist) {
    return;
  }

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Theme still applies for the current session if storage is unavailable.
  }
};

const currentTheme =
  document.documentElement.getAttribute("data-theme") || getPreferredTheme();
applyTheme(currentTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  applyTheme(nextTheme, true);
});

document.addEventListener("languagechange", () => {
  updateToggle(document.documentElement.getAttribute("data-theme") || "light");
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    try {
      if (localStorage.getItem(THEME_KEY)) {
        return;
      }
    } catch (error) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  });
