import colors from "vuetify/lib/util/colors";


let light = {
	// primary: colors.blue.darken2,
	// secondary: colors.grey.darken3,
	// accent: colors.blue.accent1,
	// error: colors.red.accent2,
	// info: colors.blue.base,
	// success: colors.green.base,
	// warning: colors.amber.base,
	background: colors.shades.white,
};

let dark = {
	// primary: "#2196F3",
	// secondary: "#424242",
	// accent: "#FF4081",
	// error: "#FF5252",
	// info: "#2196F3",
	// success: "#4CAF50",
	// warning: "#FB8C00",
	background: colors.grey.darken4,
	'background-secondary': colors.grey.darken3,
};

let dnd = {
	primary: colors.brown,
	secondary: colors.grey.darken1,
	accent: colors.shades.black,
	background: colors.brown.lighten2,
};

let cyberpunk = {
	primary: colors.pink,
	secondary: colors.grey.darken1,
	accent: colors.shades.black,
	error: colors.red.accent3,
	background: colors.grey.darken4,
	"background-secondary": colors.grey.darken3,
};

export default {
	enhanced: {
		light,
		dark,
	},
	custom: {
		dnd,
		cyberpunk
	},
	darkThemes: ['dark', 'cyberpunk'],
	THEME_KEY: 'THEME'
}

// export default {
// 	primary: {
// 		base: colors.purple.base,
// 		darken1: colors.purple.darken2,
// 	},
// 	secondary: colors.indigo,
// 	// All keys will generate theme styles,
// 	// Here we add a custom `tertiary` color
// 	tertiary: colors.pink.base,
// };
