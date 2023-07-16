import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import colors from "@/core/utils/colors";

export type Theme = "light" | "dark";

const light: ThemeDefinition = {
	dark: false,
	colors: {
		primary: colors.blue.darken2,
		accent: colors.green.base,
		"hovered-surface": colors.grey.lighten5,
		"selected-surface": colors.blue.lighten5,
	},
};

const dark: ThemeDefinition = {
	dark: true,
	colors: {
		primary: colors.pink.darken3,
		accent: colors.cyan.accent3,
		"hovered-surface": colors.grey.darken3,
		"selected-surface": colors.grey.darken2,
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
