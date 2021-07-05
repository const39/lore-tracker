<template>
	<v-container>
		<v-tabs fixed-tabs color="accent" v-model="activeTab">
			<v-tab v-for="tab in tabs" :key="tab.title">
				<v-icon left>{{ icons[tab] }}</v-icon>
				{{ $t(`objectTypes.${tab}`) }}
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="activeTab">
			<LayoutTabContent :type="objectTypes.OBJECTIVE" />
			<LayoutTabContent :type="objectTypes.EVENT" />
			<LayoutTabContent :type="objectTypes.LOCATION" />
			<LayoutTabContent :type="objectTypes.CHARACTER" />
			<LayoutTabContent :type="objectTypes.NOTE" />
		</v-tabs-items>
	</v-container>
</template>

<script>
import LayoutTabContent from "./LayoutTabContent.vue";

import constants from "../../js/constants";
import { eventHub } from "../../js/eventHub";

export default {
	name: "LayoutTabs",
	components: {
		LayoutTabContent,
	},
	data() {
		return {
			tabs: [
				constants.objectTypes.OBJECTIVE,
				constants.objectTypes.EVENT,
				constants.objectTypes.LOCATION,
				constants.objectTypes.CHARACTER,
				constants.objectTypes.NOTE,
			],
			icons: constants.icons,
			activeTab: "",
			objectTypes: constants.objectTypes,
		};
	},
	methods: {
		/**
		 * Manage each column hot key :
		 * - Alt+1 : Show Oebjective tab
		 * - Alt+2 : Show Event tab
		 * - Alt+3 : Show Location tab
		 * - Alt+4 : Show Character tab
		 * - Alt+5 : Show Note tab
		 */
		hotkey(e) {
			if (e.code.startsWith("Digit") && e.altKey) {
				let num = e.code.charAt(5);
				if (num >= 1 && num <= 5) {
					e.preventDefault();
					this.activeTab = num - 1;
				}
			}
		},
	},
	mounted() {
		// Catch TagEvent, show the according tab and scroll to the card with the specified id
		eventHub.$on("tag-selected", (e) => {
			switch (e.type) {
				case this.objectTypes.OBJECTIVE:
					this.activeTab = 0;
					break;
				case this.objectTypes.EVENT:
					this.activeTab = 1;
					break;
				case this.objectTypes.LOCATION:
					this.activeTab = 2;
					break;
				case this.objectTypes.CHARACTER:
					this.activeTab = 3;
					break;
				case this.objectTypes.NOTE:
					this.activeTab = 4;
					break;
			}
			document.getElementById(e.id + "-card")?.scrollIntoView({ behavior: "smooth" });
		});
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		eventHub.$off("tag-selected");
		document.removeEventListener("keydown", this.hotkey);
	},
};
</script>
