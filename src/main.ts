// Load global style
import "./assets/global.css";

import { createApp } from "vue";
import App from "./App.vue";

import vuetify from "./plugins/vuetify";
import pinia from "./plugins/pinia";
import router from "./router";

/* Import Vuetify v-row component globally for vuedraggable to be able to use it */
import { VRow } from "vuetify/components";

createApp(App).use(pinia).use(vuetify).use(router).component("v-row", VRow).mount("#app");
