<template>
	<v-tab-item>
		<v-container>
			<draggable
				tag="v-row"
				draggable=".item"
				v-model="items"
				v-bind="{animation: 200}"
				group="items"
				@start="drag = true"
				@end="
					drag = false;
					persist();
				"
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

import storage from "../../js/storage.js";

export default {
	name: "LayoutTabContent",
	props: {
		// Override v-model
		value: {
			type: Array,
			required: true,
		},
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
		persist() {
			storage.persist();
		},
	},
	computed: {
		/**
		 * Overwrite default v-model to bind this component's v-model attribute to the v-for.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		items: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
		cardComponent() {
			return `Card${this.capitalize(this.type)}`;
		},
		formComponent() {
			return `Form${this.capitalize(this.type)}`;
		},
	},
};
</script>

<style scoped>
.draggable {
	cursor: grab;
}
</style>
