<template>
	<v-col cols="12" md="4" sm="12">
		<v-expansion-panels v-model="isCollapsed">
			<v-expansion-panel>
				<v-expansion-panel-header>
					<div class="text-h5 text--primary">
						<v-icon left>{{ icon }}</v-icon>
						{{ title }}
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<CardAdd @add-card-clicked="showForm = true" />
					<draggable
						:disabled="isSortDisabled"
						v-model="items"
						v-bind="{ animation: 200 }"
						group="items"
						@start="drag = true"
						@end="drag = false"
						:move="onMove"
					>
						<component
							:is="cardComponent"
							v-for="item in items"
							:key="item.id"
							:item-data="item"
							outlined
							:class="{ draggable: !isSortDisabled }"
						/>
					</draggable>
					<component :is="formComponent" v-model="showForm" />
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-col>
</template>

<script>
import CardObjective from "../cards/CardObjective.vue";
import CardEvent from "../cards/CardEvent.vue";
import CardLocation from "../cards/CardLocation.vue";
import CardCharacter from "../cards/CardCharacter.vue";
import CardNote from "../cards/CardNote.vue";
import CardAdd from "../cards/CardAdd.vue";

import FormObjective from "../forms/FormObjective.vue";
import FormEvent from "../forms/FormEvent.vue";
import FormLocation from "../forms/FormLocation.vue";
import FormCharacter from "../forms/FormCharacter.vue";
import FormNote from "../forms/FormNote.vue";

import draggable from "vuedraggable";
import constants from "../../js/constants";

export default {
	name: "LayoutColumnContent",
	props: {
		type: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
	},
	components: {
		CardObjective,
		CardEvent,
		CardLocation,
		CardCharacter,
		CardNote,
		CardAdd,
		FormEvent,
		FormObjective,
		FormLocation,
		FormCharacter,
		FormNote,
		draggable,
	},
	data() {
		return {
			showForm: false,
			isCollapsed: 0,
		};
	},
	methods: {
		capitalize(str) {
			if (typeof str === "string") return str.replace(/^\w/, (c) => c.toUpperCase());
			else return "";
		},
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

			if(e.altKey) {

				if (
					(e.code === "Digit1" && this.type === constants.objectTypes.OBJECTIVE) ||
					(e.code === "Digit2" && this.type === constants.objectTypes.EVENT) ||
					(e.code === "Digit3" && this.type === constants.objectTypes.LOCATION) ||
					(e.code === "Digit4" && this.type === constants.objectTypes.CHARACTER) ||
					(e.code === "Digit5" && this.type === constants.objectTypes.NOTE)
				) {
					e.preventDefault();
					this.isCollapsed = this.isCollapsed === 0 ? 1 : 0 ;
				}
			}
		},
	},
	computed: {
		cardComponent() {
			return `Card${this.capitalize(this.type)}`;
		},
		formComponent() {
			return `Form${this.capitalize(this.type)}`;
		},
		isSortDisabled() {
			return this.$store.state.filter.isEnabled;
		},
		items: {
			get() {
				switch (this.type) {
					case constants.objectTypes.OBJECTIVE:
						return this.$store.getters.filteredData.objectives;
					case constants.objectTypes.EVENT:
						return this.$store.getters.filteredData.events;
					case constants.objectTypes.LOCATION:
						return this.$store.getters.filteredData.locations;
					case constants.objectTypes.CHARACTER:
						return this.$store.getters.filteredData.characters;
					case constants.objectTypes.NOTE:
						return this.$store.getters.filteredData.notes;
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
		document.addEventListener('keydown', this.hotkey);
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.hotkey);
	}
};
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
