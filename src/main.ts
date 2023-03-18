import { createApp } from "vue";
import App from "./App.vue";

import vuetify from "./plugins/vuetify";
import router from "./router";
import { createPinia } from "pinia";
const pinia = createPinia();

/* Import Vuetify v-row component globally for vuedraggable to be able to use it */
import { VRow } from "vuetify/components";

createApp(App).component("v-row", VRow).use(vuetify).use(router).use(pinia).mount("#app");
