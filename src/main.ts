import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@/assets/base.css";
import draggable from "vuedraggable";

const app = createApp(App);

app
  .use(router)
  .use(createPinia())
  .component("draggable", draggable)

  .mount("#app");
