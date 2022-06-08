<template>
	<v-tab-item>
		<v-container>
			<draggable
				tag="v-row"
				draggable=".item"
				:disabled="isSortDisabled"
				v-model="items"
				v-bind="{ animation: 200 }"
				group="items"
				@start="drag = true"
				@end="drag = false"
			>
				<template v-slot:header>
					<v-col cols="12" md="4">
						<CardAdd :category="category" fill-height />
					</v-col>
				</template>
				<v-col cols="12" md="4" class="item" v-for="item in items" :key="item.id">
					<CardContainer :item-data="item"></CardContainer>
				</v-col>
			</draggable>
		</v-container>
	</v-tab-item>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import CardContainer from "../cards/CardContainer.vue";
import CardAdd from "../cards/CardAdd.vue";

import draggable from "vuedraggable";
import { CardCategory, CardTypes } from "@/js/types";

export default Vue.extend({
	name: "LayoutTabContent",
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
			drag: false,
		};
	},
	computed: {
		isSortDisabled(): boolean {
			return this.$store.state.filter.isEnabled;
		},
		items: {
			get(): CardTypes[] | undefined {
				switch (this.category) {
					case CardCategory.Quest:
						return this.$store.getters.filteredCards.quests;
					case CardCategory.Event:
						return this.$store.getters.filteredCards.events;
					case CardCategory.Location:
						return this.$store.getters.filteredCards.locations;
					case CardCategory.Character:
						return this.$store.getters.filteredCards.characters;
					case CardCategory.Faction:
						return this.$store.getters.filteredCards.factions;
					case CardCategory.Note:
						return this.$store.getters.filteredCards.notes;
					default:
						return undefined;
				}
			},
			set(list: CardTypes[]) {
				this.$store.commit("updateWholeList", { category: this.category, list });
			},
		},
	},
});
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
