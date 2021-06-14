import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";

/* Import Vuetify v-row component globally for vuedraggable to be able to use it */
import { VRow } from "vuetify/lib";
Vue.component("v-row", VRow);

new Vue({
	router,
	vuetify,
	render: (h) => h(App),
}).$mount("#app");
