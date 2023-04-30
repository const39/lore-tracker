<template>
	<v-tabs v-model="activeTab" color="accent" fixed-tabs>
		<v-tab v-for="tab in tabs" :key="tab" :to="{ name: `LoreBook-${tab}` }">
			<v-icon :icon="Icon[tab]" start />
			{{ $t(`categories.${tab}`) }}
		</v-tab>
	</v-tabs>
	<v-window v-model="activeTab">
		<!-- Render LayoutTabContent component via vue-router -->
		<!-- (rendered inside v-window-item's slot because of a vue-router limitation restricting the use of router-view inside a Transition component) -->
		<router-view v-slot="{ Component }">
			<v-window-item v-for="tab in tabs" :key="tab">
				<component :is="Component" />
			</v-window-item>
		</router-view>
	</v-window>
</template>

<script lang="ts" setup>
import { onKeyDown } from "@vueuse/core";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@/core/constants";
import { eventBus } from "@/core/eventBus";
import { CardCategory } from "@/core/model/cards";
import { t as $t } from "@/core/translation";

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
