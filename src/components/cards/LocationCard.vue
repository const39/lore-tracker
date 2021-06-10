<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
			<LocationForm v-model="showEditDialog" edit :id="id"></LocationForm>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ name }}</p>
			<p class="text--primary">{{ desc }}</p>
		</v-card-text>
	</v-card>
</template>

<script>
import CardOptions from "./CardOptions.vue";
import LocationForm from "../forms/LocationForm.vue";

export default {
	name: "LocationCard",
	components: {
		CardOptions,
		LocationForm,
	},
	props: {
		id: Number,
		name: String,
		desc: String,
	},
	data() {
		return {
			showEditDialog: false,
		};
	},
	methods: {
		onOptionSelected(value) {
			if (value === "edit") this.showEditDialog = true;
			// else if (value === "delete") console.log('delete');
		},
	},
};
</script>

<style></style>
