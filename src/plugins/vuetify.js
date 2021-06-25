import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				accent: colors.lightBlue.accent3,
				background: colors.shades.white
			},
			dark: {
				primary: colors.pink.darken3,
				accent: colors.cyan.accent3,
				background: colors.grey.darken4
			}
		},
		options: {
			customProperties: true,
		},
	},
});
