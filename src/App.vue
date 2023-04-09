<template>
	<v-app>
		<v-app-bar color="primary">
			<div class="ma-2">
				<v-img class="header-icon" max-width="48px" max-height="48px" src="logo.svg"></v-img>
			</div>

			<v-app-bar-title class="text-xl-h4">Lore Tracker</v-app-bar-title>

			<v-spacer></v-spacer>

			<v-btn variant="text" :to="{ name: 'LoreBook' }">
				<span class="mr-2">{{ $t("pages.loreBook") }}</span>
			</v-btn>
			<v-btn variant="text" :to="{ name: 'Notepad' }">
				<span class="mr-2">{{ $t("pages.notepad") }}</span>
			</v-btn>
			<v-btn variant="text" :to="{ name: 'Timeline' }">
				<span class="mr-2">{{ $t("pages.timeline") }}</span>
			</v-btn>

			<!-- Options menu -->
			<v-menu location="bottom" start v-model="showMenu">
				<template v-slot:activator="{ props }">
					<v-btn icon v-bind="props">
						<v-icon>mdi-cog</v-icon>
					</v-btn>
				</template>
				<v-list density="compact">
					<v-item-group mandatory>
						<ThemeMenu />
						<LangMenu />
						<SaveMenu />
						<v-list-item prepend-icon="mdi-help-circle" link @click="showHotkeysDialog = true">
							<v-list-item-title>{{ $t("options.hotkeys.optionName") }}</v-list-item-title>
						</v-list-item>
						<v-list-item prepend-icon="mdi-information-outline" link @click="showAboutDialog = true">
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
				<v-card-text class="justify-left">
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
					<v-btn variant="text" color="primary" @click="showAboutDialog = false">{{
						$t("actions.close")
					}}</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Domain name change - TEMPORARY -->
		<v-snackbar v-model="showDomainNameChangeNotif" multi-line location="top" text timeout="-1">
			LoreTracker changes location and is now on <a href="https://lore-tracker.app">lore-tracker.app</a>.<br />If
			you are still on <a href="https://lore-tracker.herokuapp.com">lore-tracker.herokuapp.com</a>, you need to
			move your data manually before 15 November 2022. See
			<a href="https://github.com/const39/lore-tracker/releases/tag/v1.2.0" target="_blank">this page</a> to learn
			how to do it.
			<template v-slot:actions>
				<v-btn icon @click="showDomainNameChangeNotif = false">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</template>
		</v-snackbar>

		<!-- Update release notification -->
		<v-snackbar v-model="showUpdateNotif" multi-line variant="outlined" text timeout="-1">
			<div class="text-subtitle-1">{{ $t("messages.info.updateNotifTitle") }}</div>
			<div class="text-body-2">
				<a href="https://github.com/const39/lore-tracker/releases/latest" target="_blank">
					{{ $t("messages.info.updateNotifMessage") }}
				</a>
			</div>
			<template v-slot:actions>
				<v-btn icon @click="closeUpdateNotif">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</template>
		</v-snackbar>

		<!-- Global snackbar -->
		<Snackbar />
	</v-app>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { LocalStorageKey, VERSION } from "./js/types";

import { useRouter } from "vue-router";
import { useTheme } from "vuetify/lib/framework.mjs";
import HotkeyDialog from "./components/hotkeys/HotkeyDialog.vue";
import LangMenu from "./components/menus/LangMenu.vue";
import SaveMenu from "./components/menus/SaveMenu.vue";
import ThemeMenu from "./components/menus/ThemeMenu.vue";
import QuickNote from "./components/QuickNote.vue";
import Snackbar from "./components/Snackbar.vue";
import { eventBus } from "./js/eventBus";
import { useStore } from "./store";

const version = ref(VERSION);
const showMenu = ref(false);
const showHotkeysDialog = ref(false);
const showAboutDialog = ref(false);
const showUpdateNotif = ref(localStorage.getItem("VERSION") !== VERSION); // Display notif when version has changed
const showDomainNameChangeNotif = ref(Date.now() < new Date("2022-11-15T12:00:00").getTime()); // Displays until the 15/11/2022, 12:00

const router = useRouter();
const theme = useTheme();
const store = useStore();

const copyrightText = `© 2021-${new Date().getUTCFullYear()} const39`;

/**
 * Manage this component's hotkeys :
 * - On ESC press : Open/close options menu
 * - On F1 press : Navigate to LoreBook page
 * - On F2 press : Navigate to Timeline page
 */
function hotkey(e: KeyboardEvent) {
	if (e.code === "Escape") showMenu.value = !showMenu.value;
	else if (e.code === "F1") router.push({ name: "LoreBook" });
	else if (e.code === "F2") router.push({ name: "Notepad" });
	else if (e.code === "F3") router.push({ name: "Timeline" });
}

function closeUpdateNotif() {
	// Update Version number in LocalStorage to not show the notification a second time
	localStorage.setItem("VERSION", VERSION);
	showUpdateNotif.value = false;
}

onMounted(() => {
	// Initialise the store at application start
	try {
		store.loadData();
	} catch (err) {
		console.error(err);
		const message = $t("messages.errors.corruptedSave") + " " + $t("messages.errors.loadBackup");
		eventBus.emit("show-snackbar", { message, timeout: -1, color: "error" });
	}

	// Set theme if preference saved + register keyboard listener
	theme.global.name.value = localStorage.getItem(LocalStorageKey.THEME_KEY) ?? "light";
	document.addEventListener("keydown", hotkey);
});

onBeforeUnmount(() => {
	document.removeEventListener("keydown", hotkey);
});
</script>

<style>
.header-icon > img {
	position: initial;
}

.quick-note-wrapper {
	position: fixed;
	bottom: 0;
	right: 0;
	z-index: 5;
}
</style>
