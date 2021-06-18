import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import themes from "./themes.js";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
            light: themes.enhanced.light,
            dark: themes.enhanced.dark,
		},
	},
});
