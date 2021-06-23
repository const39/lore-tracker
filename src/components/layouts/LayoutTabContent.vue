<template>
	<v-tab-item>
		<v-container>
			<draggable
				tag="v-row"
				draggable=".item"
				v-model="items"
				v-bind="{ animation: 200 }"
				group="items"
				@start="drag = true"
				@end="drag = false;"
			>
				<template v-slot:header>
					<v-col cols="12" md="4">
						<CardAdd @add-card-clicked="showForm = true" />
					</v-col>
				</template>
				<v-col cols="12" md="4" class="item" v-for="item in items" :key="item.id">
					<component :is="cardComponent" class="draggable" :item-data="item" />
				</v-col>
			</draggable>
			<component :is="formComponent" v-model="showForm" />
		</v-container>
	</v-tab-item>
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
import constants from '../../js/constants';

export default {
	name: "LayoutTabContent",
	props: {
		type: {
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
		cardComponent() {
			return `Card${this.capitalize(this.type)}`;
		},
		formComponent() {
			return `Form${this.capitalize(this.type)}`;
		},
		items: {
			get() {
				switch (this.type) {
					case constants.objectTypes.OBJECTIVE:
						return this.$store.state.data.objectives;
					case constants.objectTypes.EVENT:
						return this.$store.state.data.events;
					case constants.objectTypes.LOCATION:
						return this.$store.state.data.locations;
					case constants.objectTypes.CHARACTER:
						return this.$store.state.data.characters;
					case constants.objectTypes.NOTE:
						return this.$store.state.data.notes;
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
