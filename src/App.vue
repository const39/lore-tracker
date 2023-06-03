<template>
	<v-app>
		<v-app-bar color="primary">
			<div class="ma-2 ml-4">
				<v-img class="header-icon" max-width="48px" max-height="48px" src="/logo.svg" />
			</div>

			<v-app-bar-title class="text-xl-h4">
				Lore Tracker
			</v-app-bar-title>

			<v-spacer />

			<v-btn :to="{ name: 'LoreBook' }" variant="text">
				<span class="mr-2">{{ $t("pages.loreBook") }}</span>
			</v-btn>
			<v-btn :to="{ name: 'Timeline' }" variant="text">
				<span class="mr-2">{{ $t("pages.timeline") }}</span>
			</v-btn>

			<!-- Options menu -->
			<v-menu v-model="showMenu" location="bottom" start>
				<template #activator="{ props }">
					<v-btn icon="mdi-cog" v-bind="props" />
				</template>
				<v-list density="compact">
					<v-item-group mandatory>
						<ThemeMenu />
						<LangMenu />
						<SaveMenu />
						<v-list-item
							prepend-icon="mdi-help-circle"
							link
							@click="showHotkeysDialog = true"
						>
							<v-list-item-title>
								{{ $t("options.hotkeys.optionName") }}
							</v-list-item-title>
						</v-list-item>
						<v-list-item
							prepend-icon="mdi-information-outline"
							link
							@click="showAboutDialog = true"
						>
							<v-list-item-title>
								{{ $t("options.about.optionName") }}
							</v-list-item-title>
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
			<QuickNote />
		</div>

		<!-- Hotkeys dialog -->
		<HotkeyDialog v-model="showHotkeysDialog" />

		<!-- About dialog -->
		<v-dialog v-model="showAboutDialog" max-width="450px">
			<v-card>
				<v-card-title>{{ $t("options.about.title") }}</v-card-title>
				<v-card-text class="justify-left">
					<v-container class="py-0">
						<v-row class="my-1 font-weight-medium">
							Lore Tracker {{ version }}
						</v-row>
						<v-row class="my-1">
							{{ copyrightText }}
						</v-row>
						<v-row class="my-1 align-center">
							<v-icon icon="mdi-github" />
							<a class="mx-1" href="https://github.com/const39/lore-tracker">
								{{ $t("options.about.link") }}
							</a>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn variant="text" color="primary" @click="showAboutDialog = false">
						{{ $t("actions.close") }}
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Update release notification -->
		<v-snackbar
			v-model="showUpdateNotif"
			variant="outlined"
			timeout="-1"
			multi-line
			text
		>
			<div class="text-subtitle-1">
				{{ $t("messages.info.updateNotifTitle") }}
			</div>
			<div class="text-body-2">
				<a href="https://github.com/const39/lore-tracker/releases/latest" target="_blank">
					{{ $t("messages.info.updateNotifMessage") }}
				</a>
			</div>
			<template #actions>
				<v-btn icon="mdi-close" @click="closeUpdateNotif" />
			</template>
		</v-snackbar>

		<!-- Global snackbar and confirm dialog -->
		<GlobalSnackbar />
		<GlobalConfirmDialog />
	</v-app>
</template>

<script lang="ts" setup>
import { onKeyDown } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import GlobalSnackbar from "@/components/common/GlobalSnackbar.vue";
import QuickNote from "@/components/global/QuickNote.vue";
import HotkeyDialog from "@/components/hotkeys/HotkeyDialog.vue";
import LangMenu from "@/components/menus/LangMenu.vue";
import SaveMenu from "@/components/menus/SaveMenu.vue";
import ThemeMenu from "@/components/menus/ThemeMenu.vue";
import { VERSION } from "@/core/constants";
import { t as $t } from "@/core/translation";
import { useStore } from "@/store";
import GlobalConfirmDialog from "./components/common/GlobalConfirmDialog.vue";
import { useGlobalSnackbar } from "./store/snackbar";

const version = ref(VERSION);
const showMenu = ref(false);
const showHotkeysDialog = ref(false);
const showAboutDialog = ref(false);
const showUpdateNotif = ref(localStorage.getItem("VERSION") !== VERSION); // Display notif when version has changed

const router = useRouter();
const store = useStore();
const { showSnackbar } = useGlobalSnackbar();

const copyrightText = `© 2021-${new Date().getUTCFullYear()} const39`;

// Register hotkeys
onKeyDown(["Escape", "F1", "F2", "F3"], hotkey);

/**
 * Manage this component's hotkeys :
 * - On ESC press : Open/close options menu
 * - On F1 press : Navigate to LoreBook page
 * - On F2 press : Navigate to Timeline page
 */
function hotkey(e: KeyboardEvent) {
	if (e.code === "Escape") showMenu.value = !showMenu.value;
	else if (e.code === "F1") router.push({ name: "LoreBook" });
	else if (e.code === "F2") router.push({ name: "Timeline" });
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
		showSnackbar({
			message: $t("messages.errors.corruptedSave") + " " + $t("messages.errors.loadBackup"),
			timeout: -1,
			color: "error",
		});
	}
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
