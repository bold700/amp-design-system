import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// AMP Groep brand theme — bron: Figma file 0rmsgLNBJZ7Z2EsvlbAJk3
// Primary #226499 en primary-light #CBEAFF zijn bevestigd uit Figma MCP.
// Overige kleuren zijn Material-defaults tot Foundations-pagina is uitgelezen.
const ampLight = {
  dark: false,
  colors: {
    primary: "#226499",
    "primary-lighten-1": "#CBEAFF",
    secondary: "#009688",
    success: "#43a047",
    warning: "#fb8c00",
    error: "#d32f2f",
    info: "#226499",
    surface: "#ffffff",
    background: "#f5f5f5",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    "on-surface": "#212121",
    "on-background": "#212121"
  }
};

const ampDark = {
  dark: true,
  colors: {
    primary: "#5fa8d8",
    "primary-lighten-1": "#1a3d54",
    secondary: "#4db6ac",
    success: "#66bb6a",
    warning: "#ffa726",
    error: "#ef5350",
    info: "#5fa8d8",
    surface: "#1e1e1e",
    background: "#121212",
    "on-primary": "#ffffff",
    "on-secondary": "#ffffff",
    "on-surface": "#f5f5f5",
    "on-background": "#f5f5f5"
  }
};

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "amp",
    themes: {
      amp: ampLight,
      ampDark
    }
  },
  defaults: {
    VBtn: {
      style: "text-transform: none; letter-spacing: 0.25px;"
    }
  }
});
