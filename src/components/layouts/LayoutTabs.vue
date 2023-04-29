<template>
	<v-tabs v-model="activeTab" color="accent" fixed-tabs>
		<v-tab v-for="tab in tabs" :key="tab">
			<v-icon :icon="icons[tab]" start />
			{{ $t(`categories.${tab}`) }}
		</v-tab>
	</v-tabs>
	<v-window v-model="activeTab">
		<v-window-item v-for="tab in tabs" :key="tab">
			<LayoutTabContent :category="tab" />
		</v-window-item>
	</v-window>
</template>

<script lang="ts" setup>
import { onKeyDown } from "@vueuse/core";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { eventBus } from "@/js/eventBus";
import { t as $t } from "@/js/translation";
import { CardCategory, Icon as icons } from "@/js/types";
import LayoutTabContent from "./LayoutTabContent.vue";

const tabs = ref(Object.values(CardCategory));
const activeTab = ref(0);

// Register hotkeys
onKeyDown(
	Array.from({ length: tabs.value.length }, (v, idx) => (idx + 1).toString()), // Register listener for each tab
	hotkey
);

/**
 * Manage each column hot key :
 * - Alt+1 : Show Quest tab
 * - Alt+2 : Show Event tab
 * - Alt+3 : Show Location tab
 * - Alt+4 : Show Character tab
 * - Alt+5 : Show Faction tab
 * - Alt+6 : Show Note tab
 */
function hotkey(e: KeyboardEvent) {
	if (e.altKey) {
		const num = Number.parseInt(e.key);
		if (num >= 1 && num <= tabs.value.length) {
			e.preventDefault();
			activeTab.value = num - 1;
		}
	}
}

onMounted(() => {
	// Catch TagEvent, show the according tab and scroll to the card with the specified id
	eventBus.on("select-tag", (tag) => {
		// Change active tab dynamically based on index of category in the enum
		const idx = Object.values(CardCategory).findIndex((val) => val === tag.category);
		activeTab.value = idx !== -1 ? idx : 0;

		// Scroll to card
		document.getElementById(tag.id + "-card")?.scrollIntoView({ behavior: "smooth" });
	});
});

onBeforeUnmount(() => {
	eventBus.off("select-tag");
});
</script>
