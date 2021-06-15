<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<div class="text-xl-h4 text-center">RPG campaign tracker</div>
			</div>

			<v-spacer></v-spacer>

			<router-link to="/">
				<v-btn text>
					<span class="mr-2">Lore tracker</span>
				</v-btn>
			</router-link>
			<router-link to="/timeline">
				<v-btn text>
					<span class="mr-2">Frise des événements</span>
				</v-btn>
			</router-link>
			<!-- *** Non-implemented routes *** -->
			<!-- 
			<router-link to="/dice">
				<v-btn text>
					<span class="mr-2">Dice</span>
				</v-btn>
			</router-link> -->

			<v-btn icon @click="switchTheme">
				<v-icon> {{themeIcon}} </v-icon>
			</v-btn>
			<v-btn icon @click="showExportDialog = true">
				<v-icon > mdi-download </v-icon>
			</v-btn>
		</v-app-bar>

		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>

		<!-- JSON data export dialog -->
		<v-dialog v-model="showExportDialog" scrollable max-width="600px"> 
			<v-card>
				<v-card-title>Exporter les données</v-card-title>
				<v-card-text>
					<v-textarea class="code" outlined readonly :value="jsonData"></v-textarea>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text class="text--primary" @click="showExportDialog = false">Fermer</v-btn>
					<v-btn text color="primary" @click="copyToClipboard">Copier</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-snackbar v-model="showSnackbar" timeout="2000">Données copiées dans le presse-papier.</v-snackbar>
	</v-app>
</template>

<script>
import storage from "./js/storage.js";

const DARK_THEME_KEY = 'isDarkTheme';

export default {
	name: "App",
	data() {
		return {
			showExportDialog: false,
			showSnackbar: false,
		}
	},
	methods: {
		switchTheme() {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
			localStorage.setItem(DARK_THEME_KEY, this.$vuetify.theme.dark);
		},
		async copyToClipboard() {
			try {
				await navigator.clipboard.writeText(this.jsonData);
				this.showSnackbar = true;
			} catch (error) {
				console.error("Copy to clipboard failed.");
			}
			this.showExportDialog = false;
		}
	},
	computed: {
		themeIcon() {
			return this.$vuetify.theme.dark ? 'mdi-brightness-4' : 'mdi-brightness-7';
		},
		jsonData() {
			return JSON.stringify(storage.data);
		}
	},
	created() {
		this.$vuetify.theme.dark = (localStorage.getItem(DARK_THEME_KEY) === 'true');
	}
};
</script>
<style scoped>
.code {
	font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
	font-size: 0.75rem;
	line-height: 1;
}
</style>