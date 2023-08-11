// Vuetify colors are not typed so force TS to ignore them and type them manually below
// @ts-ignore
import vuetifyColors from "vuetify/lib/util/colors";

interface BaseColor {
	base: string;
	lighten5: string;
	lighten4: string;
	lighten3: string;
	lighten2: string;
	lighten1: string;
	darken1: string;
	darken2: string;
	darken3: string;
	darken4: string;
}

interface ColorWithAccent extends BaseColor {
	accent1: string;
	accent2: string;
	accent3: string;
	accent4: string;
}

interface Shades {
	white: string;
	black: string;
	transparent: string;
}

interface Colors {
	red: ColorWithAccent;
	pink: ColorWithAccent;
	purple: ColorWithAccent;
	deepPurple: ColorWithAccent;
	indigo: ColorWithAccent;
	blue: ColorWithAccent;
	lightBlue: ColorWithAccent;
	cyan: ColorWithAccent;
	teal: ColorWithAccent;
	green: ColorWithAccent;
	lightGreen: ColorWithAccent;
	lime: ColorWithAccent;
	yellow: ColorWithAccent;
	amber: ColorWithAccent;
	orange: ColorWithAccent;
	deepOrange: ColorWithAccent;
	brown: BaseColor;
	blueGrey: BaseColor;
	grey: BaseColor;
	shades: Shades;
}

const colors: Colors = vuetifyColors;

const baseColors = Object.values(colors).map((color) => color.base ?? "#ffffff");

export function getRandomColor(): string {
	const idx = Math.floor(Math.random() * baseColors.length);
	return baseColors[idx];
}

export default colors;
