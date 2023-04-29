import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import colors from "@/js/colors";

const light: ThemeDefinition = {
	dark: false,
	colors: {
		primary: colors.blue.darken2,
		accent: colors.green.base,
	},
};

const dark: ThemeDefinition = {
	dark: true,
	colors: {
		primary: colors.pink.darken3,
		accent: colors.cyan.accent3,
	},
};

export default createVuetify({
	theme: {
		defaultTheme: "light",
		themes: {
			light,
			dark,
		},
	},
});
