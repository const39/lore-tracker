<template>
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
				<CardContainer :class="{ draggable: !isSortDisabled }" :item-data="item"></CardContainer>
			</v-col>
		</draggable>
	</v-container>
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
			return this.$store.getters.isFilterActive || !this.$store.getters.isDefaultOrder;
		},
		items: {
			get(): CardTypes[] {
				return this.$store.getters.getCards[this.category];
			},
			set(list: CardTypes[]) {
				this.$store.dispatch("commitAndSave", {
					commit: "updateWholeList",
					payload: { category: this.category, list },
				});
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
