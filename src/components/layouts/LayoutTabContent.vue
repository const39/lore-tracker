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
						<CardAdd :type="type" />
					</v-col>
				</template>
				<v-col cols="12" md="4" class="item" v-for="item in items" :key="item.id">
					<CardContainer :item-data="item"></CardContainer>
				</v-col>
			</draggable>
		</v-container>
	</v-tab-item>
</template>

<script>
import CardContainer from "../cards/CardContainer.vue";
import CardAdd from "../cards/CardAdd.vue";

import draggable from "vuedraggable";
import constants from "../../js/constants";

export default {
	name: "LayoutTabContent",
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
			drag: false,
		};
	},
	methods: {
		capitalize(str) {
			if (typeof str === "string") return str.replace(/^\w/, (c) => c.toUpperCase());
			else return "";
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
};
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
