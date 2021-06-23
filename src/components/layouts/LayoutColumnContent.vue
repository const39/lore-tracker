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
						v-model="items"
						v-bind="{ animation: 200 }"
						group="items"
						@start="drag = true"
						@end="drag = false;"
					>
						<component
							:is="cardComponent"
							v-for="item in items"
							:key="item.id"
							:item-data="item"
							outlined
							class="draggable"
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
import constants from '../../js/constants';

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
