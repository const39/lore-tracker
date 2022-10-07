<template>
	<v-container>
		<v-tabs fixed-tabs color="accent" v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab">
				<v-icon left>{{ icons[tab] }}</v-icon>
				{{ $t(`categories.${tab}`) }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<v-tab-item v-for="tab in tabs" :key="tab">
				<LayoutTabContent :category="tab" />
			</v-tab-item>
		</v-tabs-items>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LayoutTabContent from "./LayoutTabContent.vue";

import { CardCategory, Icon } from "@/js/types";
import { eventHub, TagEvent } from "@/js/eventHub";

export default Vue.extend({
	name: "LayoutTabs",
	components: {
		LayoutTabContent,
	},
	data() {
		return {
			tabs: Object.values(CardCategory),
			icons: Icon,
			activeTab: 0,
		};
	},
	methods: {
		/**
		 * Manage each column hot key :
		 * - Alt+1 : Show Quest tab
		 * - Alt+2 : Show Event tab
		 * - Alt+3 : Show Location tab
		 * - Alt+4 : Show Character tab
		 * - Alt+5 : Show Faction tab
		 * - Alt+6 : Show Note tab
		 */
		hotkey(e: KeyboardEvent) {
			if (e.code.startsWith("Digit") && e.altKey) {
				let num = Number.parseInt(e.code.charAt(5));
				if (num >= 1 && num <= this.tabs.length) {
					e.preventDefault();
					this.activeTab = num - 1;
				}
			}
		},
	},
	mounted() {
		// Catch TagEvent, show the according tab and scroll to the card with the specified id
		eventHub.$on(TagEvent.ID, (e: TagEvent) => {
			// Change active tab dynamically based on index of category in the enum
			const idx = Object.values(CardCategory).findIndex((val) => val === e.tag.category);
			this.activeTab = idx !== -1 ? idx : 0;

			// Scroll to card
			document.getElementById(e.tag.id + "-card")?.scrollIntoView({ behavior: "smooth" });
		});
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		eventHub.$off(TagEvent.ID);
		document.removeEventListener("keydown", this.hotkey);
	},
});
</script>
