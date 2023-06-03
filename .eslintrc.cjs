/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"@vue/eslint-config-typescript/recommended",
		// "prettier",
	],
	plugins: ["import"],
	rules: {
		"import/order": [
			"warn",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
					"type",
				],
				pathGroups: [
					{
						pattern: "@/**",
						group: "internal",
					},
				],
				pathGroupsExcludedImportTypes: ["internal"],
				"newlines-between": "never",
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
		"vue/multi-word-component-names": "off",
		"vue/no-ref-object-destructure": "warn",
		"vue/html-indent": ["error", "tab"],
		"vue/script-indent": [
			"error",
			"tab",
			{
				switchCase: 1,
			},
		],
		"vue/max-attributes-per-line": [
			"error",
			{
				singleline: 4,
				multiline: 1,
			},
		],
		"vue/attributes-order": [
			"error",
			{
				order: [
					"DEFINITION",
					"LIST_RENDERING",
					"CONDITIONALS",
					"RENDER_MODIFIERS",
					"GLOBAL",
					"UNIQUE",
					"SLOT",
					"TWO_WAY_BINDING",
					"OTHER_DIRECTIVES",
					// "OTHER_ATTR",
					"ATTR_DYNAMIC",
					"ATTR_STATIC",
					"ATTR_SHORTHAND_BOOL",
					"EVENTS",
					"CONTENT",
				],
				alphabetical: false,
			},
		],
		"vue/no-static-inline-styles": "error",
		"vue/no-useless-concat": "error",
		"vue/define-macros-order": "error",
		"vue/define-props-declaration": "error",
		"vue/no-empty-component-block": "error",
		"vue/component-api-style": ["error", ["script-setup"]],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/ban-ts-comment": "off",
	},
};
