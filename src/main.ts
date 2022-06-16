import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from './store'

/* Import Vuetify v-row component globally for vuedraggable to be able to use it */
import { VRow } from "vuetify/lib";
Vue.component("v-row", VRow);

/* Set translation function as global function */
import translation from "./js/translation";
Vue.prototype.$t = translation.t;

new Vue({
	router,
	vuetify,
	store,
	render: (h) => h(App),
}).$mount("#app");
