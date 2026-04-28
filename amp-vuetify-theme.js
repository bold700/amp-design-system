(function () {
  const AMP_LIGHT = {
    primary: "#226499",
    secondary: "#009688",
    success: "#43a047",
    warning: "#fb8c00",
    error: "#d32f2f",
    info: "#226499",
    background: "#ffffff",
    surface: "#ffffff"
  };

  const AMP_DARK = {
    primary: "#5fa8d8",
    secondary: "#4db6ac",
    success: "#66bb6a",
    warning: "#ffa726",
    error: "#ef5350",
    info: "#5fa8d8",
    background: "#121212",
    surface: "#1e1e1e"
  };

  function resolveInitialDark(html) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return html.getAttribute("data-theme") === "dark" || (!html.hasAttribute("data-theme") && prefersDark);
  }

  function create() {
    const html = document.documentElement;
    const initialDark = resolveInitialDark(html);
    if (initialDark) html.setAttribute("data-theme", "dark");

    const vuetify = Vuetify.createVuetify({
      theme: {
        defaultTheme: initialDark ? "ampDark" : "amp",
        themes: {
          amp: { dark: false, colors: AMP_LIGHT },
          ampDark: { dark: true, colors: AMP_DARK }
        }
      }
    });

    function applyTheme(dark) {
      if (dark) {
        html.setAttribute("data-theme", "dark");
        vuetify.theme.global.name.value = "ampDark";
      } else {
        html.removeAttribute("data-theme");
        vuetify.theme.global.name.value = "amp";
      }
    }

    return { vuetify, initialDark, applyTheme };
  }

  window.AmpVuetifyTheme = { create };
})();
