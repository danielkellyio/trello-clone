import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@/assets/base.css";
import draggable from "vuedraggable";
import { plugin as formkitPlugin, defaultConfig } from "@formkit/vue";
import "@formkit/themes/genesis";
import "@progress/kendo-theme-default/dist/all.css";

const app = createApp(App);

app
  .use(router)
  .use(createPinia())
  .use(formkitPlugin, defaultConfig)
  .component("draggable", draggable)

  .mount("#app");
