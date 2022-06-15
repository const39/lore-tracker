<template>
	<v-col cols="12" md="4" sm="12">
		<v-expansion-panels v-model="isCollapsed">
			<v-expansion-panel>
				<v-expansion-panel-header>
					<div class="text-h5 text--primary">
						<v-icon left>{{ icons[category] }}</v-icon>
						{{ $t(`categories.${category}`) }}
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<CardAdd :category="category" :fill-height="false" />
					<draggable
						:disabled="isSortDisabled"
						v-model="items"
						v-bind="{ animation: 200 }"
						group="items"
						@start="drag = true"
						@end="drag = false"
						:move="onMove"
					>
						<CardContainer
							v-for="item in items"
							:key="item.id"
							outlined
							:class="{ draggable: !isSortDisabled }"
							:item-data="item"
						></CardContainer>
					</draggable>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-col>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import CardContainer from "../cards/CardContainer.vue";
import CardAdd from "../cards/CardAdd.vue";

import draggable from "vuedraggable";
import { Icon, CardCategory, CardTypes } from "@/js/types";

export default Vue.extend({
	name: "LayoutColumnContent",
	props: {
		category: {
			type: String as PropType<CardCategory>,
			required: true,
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
			icons: Icon,
		};
	},
	methods: {
		onMove(e: any) {
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
		 * - Alt+1 : Collapse/expand Objective tab
		 * - Alt+2 : Collapse/expand Event tab
		 * - Alt+3 : Collapse/expand Location tab
		 * - Alt+4 : Collapse/expand Character tab
		 * - Alt+5 : Collapse/expand Faction tab
		 * - Alt+6 : Collapse/expand Note tab
		 */
		hotkey(e: KeyboardEvent) {
			if (e.altKey) {
				if (
					(e.code === "Digit1" && this.category === CardCategory.Quest) ||
					(e.code === "Digit2" && this.category === CardCategory.Event) ||
					(e.code === "Digit3" && this.category === CardCategory.Location) ||
					(e.code === "Digit4" && this.category === CardCategory.Character) ||
					(e.code === "Digit5" && this.category === CardCategory.Faction) ||
					(e.code === "Digit6" && this.category === CardCategory.Note)
				) {
					e.preventDefault();
					this.isCollapsed = this.isCollapsed === 0 ? 1 : 0;
				}
			}
		},
	},
	computed: {
		isSortDisabled(): boolean {
			return this.$store.state.filter.isEnabled;
		},
		items: {
			get(): CardTypes[] {
				return this.$store.getters.filteredCards[this.category];
			},
			set(list: CardTypes[]) {
				this.$store.commit("updateWholeList", { category: this.category, list });
			},
		},
	},
	mounted() {
		document.addEventListener("keydown", this.hotkey);
	},
	beforeDestroy() {
		document.removeEventListener("keydown", this.hotkey);
	},
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
