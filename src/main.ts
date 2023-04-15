import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import router from "./router";

/* Import Vuetify v-row component globally for vuedraggable to be able to use it */
import { VRow } from "vuetify/components";

createApp(App).use(createPinia()).use(vuetify).use(router).component("v-row", VRow).mount("#app");
