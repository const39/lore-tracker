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

			<!-- Options menu -->
			<v-menu bottom left offset-y v-model="showMenu" ref="options-menu">
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-cog</v-icon>
					</v-btn>
				</template>
				<v-list dense flat>
					<v-item-group mandatory ref="options-list">
						<v-menu offset-x left>
							<template v-slot:activator="{ on, attrs }">
								<v-list-item v-on="on" v-bind="attrs">
									<v-list-item-icon>
										<v-icon>mdi-chevron-left</v-icon>
									</v-list-item-icon>
									<v-list-item-title>Changer de thème</v-list-item-title>
								</v-list-item>
							</template>
							<ThemeSelector />
						</v-menu>
						<v-list-item @click="showHotkeysDialog = true">
							<v-list-item-icon>
								<v-icon>mdi-help-circle</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Afficher les raccourcis</v-list-item-title>
						</v-list-item>
						<v-list-item @click="copyToClipboard">
							<v-list-item-icon>
								<v-icon>mdi-content-copy</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Copier les données</v-list-item-title>
						</v-list-item>
						<v-list-item @click="showConfirmDialog">
							<v-list-item-icon>
								<v-icon color="red">mdi-delete</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="red--text">Effacer les données</v-list-item-title>
						</v-list-item>
					</v-item-group>
				</v-list>
			</v-menu>
		</v-app-bar>

		<!-- Mount point for VueRouter -->
		<v-main>
			<v-container>
				<router-view />
			</v-container>
		</v-main>

		<!-- Global confirm dialog for options -->
		<ConfirmDialog
			v-model="confirmDialog.show"
			:title="confirmDialog.title"
			:message="confirmDialog.message"
			:acceptAction="confirmDialog.acceptAction"
		/>

		<!-- Hotkeys dialog -->
		<HotkeyDialog v-model="showHotkeysDialog" />

		<!-- Global snackbar -->
		<v-snackbar v-model="showSnackbar" timeout="2000" color="success">
			Données copiées dans le presse-papier.
			<template v-slot:action="{ attrs }">
				<v-btn icon v-bind="attrs" @click="showSnackbar = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</v-app>
</template>

<script>
import constants from "./js/constants.js";

import ConfirmDialog from "./components/ConfirmDialog.vue";
import HotkeyDialog from "./components/HotkeyDialog.vue";
import ThemeSelector from "./components/ThemeSelector.vue";

export default {
	name: "App",
	components: {
		ConfirmDialog,
		HotkeyDialog,
		ThemeSelector,
	},
	data() {
		return {
			showMenu: false,
			showSnackbar: false,
			showHotkeysDialog: false,
			confirmDialog: {
				show: false,
				title: undefined,
				message: undefined,
				acceptAction: undefined,
			},
		};
	},
	methods: {
		async copyToClipboard() {
			try {
				await navigator.clipboard.writeText(this.$store.state.cards);
				this.showSnackbar = true;
			} catch (error) {
				console.error("Copy to clipboard failed.");
			}
			this.showExportDialog = false;
		},
		showConfirmDialog() {
			this.confirmDialog.title = "Effacer les données ?";
			this.confirmDialog.message =
				"Vous perdrez toutes les données enregistrées. Si vous souhaitez effacer les données, il est conseillé d'en faire une copie d'abord.";
			this.confirmDialog.acceptAction = () => this.$store.commit("resetData");
			this.confirmDialog.show = true;
		},
		/**
		 * Manage this component's hotkeys :
		 * - On ESC press : Open/close options menu
		 * - On F1 press : Navigate to Lore Tracker page
		 * - On F2 press : Navigate to Timeline page
		 */
		hotkey(e) {
			if (e.code === "Escape") this.showMenu = !this.showMenu;
			else if (e.code === "F1") this.$router.push({ name: "Home" });
			else if (e.code === "F2") this.$router.push("timeline");
		},
	},
	mounted() {
		this.$vuetify.theme.dark = localStorage.getItem(constants.localStorageKeys.THEME_KEY) === "dark";
		document.addEventListener("keydown", this.hotkey);
	},
	created() {
		// Initialise the store at application start
		this.$store.commit("initData");
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.hotkey);
	},
};
</script>
