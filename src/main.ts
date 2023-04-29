// Load global style
import "./assets/global.css";

import { createApp } from "vue";
import { VRow } from "vuetify/components";
import App from "./App.vue";
import pinia from "./plugins/pinia";
import vuetify from "./plugins/vuetify";
import router from "./router";

/* Import Vuetify v-row component globally for vuedraggable to be able to use it */

createApp(App).use(pinia).use(vuetify).use(router).component("v-row", VRow).mount("#app");
