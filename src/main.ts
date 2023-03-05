import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
const vuetify = createVuetify();

import router from "./router";

import { createPinia } from "pinia";
const pinia = createPinia();

createApp(App).use(vuetify).use(router).use(pinia).mount("#app");
