<template>
	<v-col cols="12" md="4" sm="12">
		<v-expansion-panels v-model="isCollapsed">
			<v-expansion-panel>
				<v-expansion-panel-header>
					<div class="text-h5 text--primary">
						<v-icon left>{{ icons[type] }}</v-icon>
						{{ $t(`objectTypes.${type}`) }}
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<CardAdd :type="type" />
					<draggable
						:disabled="isSortDisabled"
						v-model="items"
						v-bind="{ animation: 200 }"
						group="items"
						@start="drag = true"
						@end="drag = false"
						:move="onMove"
					>
						<CardContainer v-for="item in items" :key="item.id" outlined :item-data="item"></CardContainer>
					</draggable>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-col>
</template>

<script>
import CardContainer from "../cards/CardContainer.vue";
import CardAdd from "../cards/CardAdd.vue";

import draggable from "vuedraggable";
import constants from "../../js/constants";

export default {
	name: "LayoutColumnContent",
	props: {
		type: {
			type: String,
			required: true,
			validator: function(value) {
				return (
					Object.values(constants.objectTypes).includes(value.toString().toLowerCase()) &&
					value !== constants.objectTypes.ALL
				);
			},
		},
	},
	components: {
		CardContainer,
		CardAdd,
		draggable,
	},
	data() {
		return {
			isCollapsed: 0,
			icons: constants.icons,
		};
	},
	methods: {
		onMove(e) {
			/**
			 * Check if origin element ("draggedContext") type and target element ("relatedContext") type are the same
			 * This is to check that the dragged element will remain in the same list and not be dragged into another adjacent column
			 * If both elements type are the same, this function will return true and authorize the drag
			 * If they are different, it will return false to cancel the drag
			 */
			return e.draggedContext.element.constructor.name === e.relatedContext.element.constructor.name;
		},
		/**
		 * Manage each column hot key :
		 * - Alt+1 : Collapse/expand Oebjective tab
		 * - Alt+2 : Collapse/expand Event tab
		 * - Alt+3 : Collapse/expand Location tab
		 * - Alt+4 : Collapse/expand Character tab
		 * - Alt+5 : Collapse/expand Note tab
		 */
		hotkey(e) {
			if (e.altKey) {
				if (
					(e.code === "Digit1" && this.type === constants.objectTypes.OBJECTIVE) ||
					(e.code === "Digit2" && this.type === constants.objectTypes.EVENT) ||
					(e.code === "Digit3" && this.type === constants.objectTypes.LOCATION) ||
					(e.code === "Digit4" && this.type === constants.objectTypes.CHARACTER) ||
					(e.code === "Digit5" && this.type === constants.objectTypes.NOTE)
				) {
					e.preventDefault();
					this.isCollapsed = this.isCollapsed === 0 ? 1 : 0;
				}
			}
		},
	},
	computed: {
		isSortDisabled() {
			return this.$store.state.filter.isEnabled;
		},
		items: {
			get() {
				switch (this.type) {
					case constants.objectTypes.OBJECTIVE:
						return this.$store.getters.filteredCards.objectives;
					case constants.objectTypes.EVENT:
						return this.$store.getters.filteredCards.events;
					case constants.objectTypes.LOCATION:
						return this.$store.getters.filteredCards.locations;
					case constants.objectTypes.CHARACTER:
						return this.$store.getters.filteredCards.characters;
					case constants.objectTypes.NOTE:
						return this.$store.getters.filteredCards.notes;
					default:
						return undefined;
				}
			},
			set(list) {
				this.$store.commit("updateWholeList", { type: this.type, list: list });
			},
		},
	},
	mounted() {
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.hotkey);
	},
};
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
