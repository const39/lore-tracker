<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="ma-2">
				<v-img max-width="48px" max-height="48px" src="./assets/logo.svg"></v-img>
			</div>

			<div class="d-flex align-center">
				<div class="text-xl-h4 text-center">Lore Tracker</div>
			</div>

			<v-spacer></v-spacer>

			<router-link :to="{ name: 'Home' }">
				<v-btn text>
					<span class="mr-2">{{ $t("pages.home") }}</span>
				</v-btn>
			</router-link>
			<router-link :to="{ name: 'Timeline' }">
				<v-btn text>
					<span class="mr-2">{{ $t("pages.timeline") }}</span>
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
						<!-- TODO Language change not fully implemented -->
						<!-- <LangSelector /> -->
						<ThemeSelector />
						<v-list-item @click="showHotkeysDialog = true">
							<v-list-item-icon>
								<v-icon>mdi-help-circle</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{ $t("options.hotkeys.optionName") }}</v-list-item-title>
						</v-list-item>
						<v-list-item @click="copyToClipboard">
							<v-list-item-icon>
								<v-icon>mdi-content-copy</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{ $t("options.copyData.optionName") }}</v-list-item-title>
						</v-list-item>
						<v-list-item @click="showConfirmDialog">
							<v-list-item-icon>
								<v-icon color="red">mdi-delete</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="red--text">
								{{ $t("options.deleteData.optionName") }}
							</v-list-item-title>
						</v-list-item>
						<v-list-item @click="showAboutDialog = true">
							<v-list-item-icon>
								<v-icon>mdi-information-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{ $t("options.about.optionName") }}</v-list-item-title>
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

		<!-- Quick note - Floating expanding text area -->
		<div class="ma-4 quick-note-wrapper">
			<QuickNote></QuickNote>
		</div>

		<!-- Global confirm dialog for options -->
		<ConfirmDialog
			v-model="confirmDialog.show"
			:title="confirmDialog.title"
			:message="confirmDialog.message"
			:acceptAction="confirmDialog.acceptAction"
		/>

		<!-- Hotkeys dialog -->
		<HotkeyDialog v-model="showHotkeysDialog" />

		<!-- About dialog -->
		<v-dialog v-model="showAboutDialog" max-width="450px">
			<v-card>
				<v-card-title>{{ $t("options.about.title") }}</v-card-title>
				<v-card-text class="justify-left text--primary">
					<v-container class="py-0">
						<v-row class="my-1 font-weight-medium">Lore Tracker {{ version }}</v-row>
						<v-row class="my-1">© 2021 - const39</v-row>
						<v-row class="my-1 align-center">
							<v-icon>mdi-github</v-icon>
							<a class="mx-1" href="https://github.com/const39/lore-tracker">{{
								$t("options.about.link")
							}}</a>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click="showAboutDialog = false">{{ $t("actions.close") }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Global snackbar -->
		<v-snackbar v-model="showSnackbar" timeout="2000" color="success">
			{{ $t("options.copyData.success") }}
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
import HotkeyDialog from "./components/hotkeys/HotkeyDialog.vue";
import ThemeSelector from "./components/selectors/ThemeSelector.vue";
import QuickNote from "./components/QuickNote.vue";

export default {
	name: "App",
	components: {
		ConfirmDialog,
		HotkeyDialog,
		ThemeSelector,
		QuickNote
	},
	data() {
		return {
			version: constants.VERSION,
			showMenu: false,
			showSnackbar: false,
			showHotkeysDialog: false,
			showAboutDialog: false,
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
				await navigator.clipboard.writeText(this.$store.getters.getJsonData);
				this.showSnackbar = true;
			} catch (error) {
				console.error("Copy to clipboard failed.");
			}
			this.showExportDialog = false;
		},
		showConfirmDialog() {
			this.confirmDialog.title = this.$t("options.deleteData.title");
			this.confirmDialog.message = this.$t("options.deleteData.message");
			this.confirmDialog.acceptAction = () => this.$store.commit("resetData");
			this.confirmDialog.show = true;
		},
		/**
		 * Manage this component's hotkeys :
		 * - On ESC press : Open/close options menu
		 * - On F1 press : Navigate to Home page
		 * - On F2 press : Navigate to Timeline page
		 */
		hotkey(e) {
			if (e.code === "Escape") this.showMenu = !this.showMenu;
			else if (e.code === "F1") this.$router.push({ name: "Home" });
			else if (e.code === "F2") this.$router.push({ name: "Timeline" });
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

<style scoped>
.quick-note-wrapper {
	position: fixed;
	bottom: 0;
	right: 0;
}
</style>
