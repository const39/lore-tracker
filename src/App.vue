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
			<v-menu bottom left offset-y v-model="showMenu">
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-cog</v-icon>
					</v-btn>
				</template>
				<v-list dense>
					<v-item-group mandatory>
						<ThemeMenu />
						<LangMenu />
						<SaveMenu />
						<v-list-item link @click="showHotkeysDialog = true">
							<v-list-item-icon>
								<v-icon>mdi-help-circle</v-icon>
							</v-list-item-icon>
							<v-list-item-title>{{ $t("options.hotkeys.optionName") }}</v-list-item-title>
						</v-list-item>
						<v-list-item link @click="showAboutDialog = true">
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

		<!-- Hotkeys dialog -->
		<HotkeyDialog v-model="showHotkeysDialog" />

		<!-- About dialog -->
		<v-dialog v-model="showAboutDialog" max-width="450px">
			<v-card>
				<v-card-title>{{ $t("options.about.title") }}</v-card-title>
				<v-card-text class="justify-left text--primary">
					<v-container class="py-0">
						<v-row class="my-1 font-weight-medium">Lore Tracker {{ version }}</v-row>
						<v-row class="my-1">{{ copyrightText }}</v-row>
						<v-row class="my-1 align-center">
							<v-icon>mdi-github</v-icon>
							<a class="mx-1" href="https://github.com/const39/lore-tracker">
								{{ $t("options.about.link") }}
							</a>
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
		<Snackbar />
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { VERSION, LocalStorageKey } from "./js/types";

import HotkeyDialog from "./components/hotkeys/HotkeyDialog.vue";
import ThemeMenu from "./components/menus/ThemeMenu.vue";
import LangMenu from "./components/menus/LangMenu.vue";
import SaveMenu from "./components/menus/SaveMenu.vue";
import QuickNote from "./components/QuickNote.vue";
import Snackbar from "./components/Snackbar.vue";
import { eventHub, SnackbarEvent } from "./js/eventHub";

export default Vue.extend({
	name: "App",
	components: {
		HotkeyDialog,
		ThemeMenu,
		LangMenu,
		SaveMenu,
		QuickNote,
		Snackbar,
	},
	data() {
		return {
			version: VERSION,
			showMenu: false,
			showHotkeysDialog: false,
			showAboutDialog: false,
		};
	},
	methods: {
		/**
		 * Manage this component's hotkeys :
		 * - On ESC press : Open/close options menu
		 * - On F1 press : Navigate to Home page
		 * - On F2 press : Navigate to Timeline page
		 */
		hotkey(e: KeyboardEvent) {
			if (e.code === "Escape") this.showMenu = !this.showMenu;
			else if (e.code === "F1") this.$router.push({ name: "Home" });
			else if (e.code === "F2") this.$router.push({ name: "Timeline" });
		},
	},
	computed: {
		copyrightText(): string {
			return `© 2021-${new Date().getUTCFullYear()} const39`;
		},
	},
	mounted() {
		// Initialise the store at application start
		try {
			this.$store.dispatch("loadData");
		} catch (err) {
			console.error(err);
			const msg = this.$t("messages.errors.corruptedSave") + " " + this.$t("messages.errors.loadBackup");
			eventHub.$emit(SnackbarEvent.ID, new SnackbarEvent(msg, -1, "error"));
		}

		// Set theme if preference saved + register keyboard listener
		this.$vuetify.theme.dark = localStorage.getItem(LocalStorageKey.THEME_KEY) === "dark";
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.hotkey);
	},
});
</script>

<style scoped>
.quick-note-wrapper {
	position: fixed;
	bottom: 0;
	right: 0;
	z-index: 5;
}
</style>
