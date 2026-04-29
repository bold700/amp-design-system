import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "ampLab",
    themes: {
      ampLab: {
        dark: false,
        colors: {
          primary: "#1e88e5",
          secondary: "#546e7a",
          success: "#43a047",
          surface: "#ffffff",
          background: "#f0f0f0"
        }
      }
    }
  }
});
