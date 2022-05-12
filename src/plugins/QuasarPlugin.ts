// --------------------------
// Quasar
// --------------------------
import { Quasar } from "quasar";
// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

// Import icon libraries
import "@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css";
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

export default (app) => {
  app.use(Quasar, { plugins: {} });
};
