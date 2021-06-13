<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
			<LocationForm v-model="showEditDialog" edit :id="id"></LocationForm>
			<ConfirmDialog
				v-model="showDeleteDialog"
				:acceptAction="deleteLocation"
				:title="`Supprimer ${name} ?`"
				:message="'Voulez-vous vraiment supprimer cette localité ?'"
			></ConfirmDialog>
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
import ConfirmDialog from "../ConfirmDialog.vue";

import storage from "../../js/storage.js";

export default {
	name: "LocationCard",
	components: {
		CardOptions,
		LocationForm,
		ConfirmDialog,
	},
	props: {
		id: Number,
		name: String,
		desc: String,
	},
	data() {
		return {
			showEditDialog: false,
			showDeleteDialog: false,
		};
	},
	methods: {
		onOptionSelected(value) {
			if (value === "edit") this.showEditDialog = true;
			else if (value === "delete") this.showDeleteDialog = true;
		},
		deleteLocation() {
			storage.deleteLocation(this.id);
		},
	},
};
</script>

<style></style>
