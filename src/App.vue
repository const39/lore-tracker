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

			<v-btn :to="{ name: 'Campaigns' }" variant="text">
				<span class="mr-2">{{ $t("pages.campaigns.name") }}</span>
			</v-btn>

			<!-- Display campaign-specific navigation buttons when we're on a campaign's LoreBook -->
			<template v-if="campaignId">
				<v-divider class="mx-2" vertical />

				<v-btn :to="{ name: 'LoreBookRoot', params: { campaignId } }" variant="text">
					<span class="mr-2">{{ $t("pages.loreBook.name") }}</span>
				</v-btn>

				<v-btn :to="{ name: 'Timeline', params: { campaignId } }" variant="text">
					<span class="mr-2">{{ $t("pages.timeline.name") }}</span>
				</v-btn>
			</template>

			<!-- Options menu -->
			<v-menu v-model="showMenu" location="bottom" close-on-content-click start>
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
			<v-container class="h-100">
				<div v-if="loading" class="h-100 d-flex align-center justify-center">
					<v-progress-circular color="primary" size="large" indeterminate />
				</div>
				<router-view v-else />
			</v-container>
		</v-main>

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
			:color="preferences.theme === 'light' ? 'grey-lighten-3' : 'grey-darken-3'"
			variant="flat"
			timeout="-1"
			multi-line
		>
			<div class="text-subtitle-1">
				{{ $t("messages.info.updateNotif.title") }}
			</div>
			<div class="text-body-2">
				<a href="https://github.com/const39/lore-tracker/releases/latest" target="_blank">
					{{ $t("messages.info.updateNotif.message") }}
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
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import GlobalSnackbar from "@/components/common/GlobalSnackbar.vue";
import HotkeyDialog from "@/components/hotkeys/HotkeyDialog.vue";
import LangMenu from "@/components/menus/LangMenu.vue";
import SaveMenu from "@/components/menus/SaveMenu.vue";
import ThemeMenu from "@/components/menus/ThemeMenu.vue";
import { loadSavedData } from "@/core/save/save-manager";
import { t as $t } from "@/core/translation";
import { VERSION } from "@/core/utils/types";
import { usePreferencesStore } from "@/store/preferences";
import { useGlobalSnackbar } from "@/store/snackbar";
import GlobalConfirmDialog from "./components/common/GlobalConfirmDialog.vue";
import eventBus from "./core/eventBus";

const version = ref(VERSION);
const loading = ref(false);
const showMenu = ref(false);
const showHotkeysDialog = ref(false);
const showAboutDialog = ref(false);
const showUpdateNotif = ref(localStorage.getItem("VERSION") !== VERSION); // Display notif when version has changed

const route = useRoute();
const preferences = usePreferencesStore();
const { showSnackbar } = useGlobalSnackbar();

const copyrightText = `© 2021-${new Date().getUTCFullYear()} const39`;

const campaignId = computed(() => route.params.campaignId);

// Toggle options menu on ESC
onKeyDown("Escape", () => (showMenu.value = !showMenu.value));

function closeUpdateNotif() {
	// Update Version number in LocalStorage to not show the notification a second time
	localStorage.setItem("VERSION", VERSION);
	showUpdateNotif.value = false;
}

async function initApp() {
	loading.value = true;

	try {
		await loadSavedData();
	} catch (err) {
		console.error(err);
		const message =
			$t("messages.errors.save.corruptedSave") + " " + $t("messages.errors.save.loadBackup");
		showSnackbar({
			message,
			timeout: -1,
			color: "error",
		});
	}

	loading.value = false;
}

// Trigger update on data load (e.g. on app start or on save import)
eventBus.on(async (e) => {
	if (e === "data-loaded") await initApp();
});

onMounted(() => {
	// Load stored data at application start
	eventBus.emit("data-loaded");

	// Show a periodic reminder to backup the save file (1h after app startup)
	setTimeout(() => {
		showSnackbar({
			message: $t('messages.info.backupReminder.message'),
			timeout: 20000,
			color: "grey-lighten-2",
			icon: "mdi-information-outline",
			location: "top",
		});
	}, 60 * 60 * 1000);
});
</script>

<style>
.header-icon > img {
	position: initial;
}
</style>
