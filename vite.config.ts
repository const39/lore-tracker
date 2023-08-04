import path from "path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
	// Enable experimental defineModel() macro
	plugins: [vue({ script: { defineModel: true } }), vuetify({ autoImport: true })],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	esbuild: {
		supported: {
			"top-level-await": true,
		},
	},
	define: {
		// Generate app version from package.json version during build phase
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
});
