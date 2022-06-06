<template>
	<v-container>
		<v-tabs fixed-tabs color="accent" v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab">
				<v-icon left>{{ icons[tab] }}</v-icon>
				{{ $t(`objectTypes.${tab}`) }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<LayoutTabContent v-for="tab in tabs" :key="tab" :category="tab" />
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
		 * - Alt+1 : Show Objective tab
		 * - Alt+2 : Show Event tab
		 * - Alt+3 : Show Location tab
		 * - Alt+4 : Show Character tab
		 * - Alt+5 : Show Note tab
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
		eventHub.$on("tag-selected", (e: TagEvent) => {
			// TODO map 'tabs' array to object (name -> idx), to retrieve index automatically without switch/case
			switch (e.tag.category) {
				case CardCategory.Objective:
					this.activeTab = 0;
					break;
				case CardCategory.Event:
					this.activeTab = 1;
					break;
				case CardCategory.Location:
					this.activeTab = 2;
					break;
				case CardCategory.Character:
					this.activeTab = 3;
					break;
				case CardCategory.Note:
					this.activeTab = 4;
					break;
			}
			document.getElementById(e.tag.id + "-card")?.scrollIntoView({ behavior: "smooth" });
		});
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		eventHub.$off("tag-selected");
		document.removeEventListener("keydown", this.hotkey);
	},
});
</script>
