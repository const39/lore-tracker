<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
            <ConfirmDialog
				v-model="showDeleteDialog"
				:acceptAction="deleteNote"
				:title="`Supprimer ${title} ?`"
				:message="'Voulez-vous vraiment supprimer cette note ?'"
			></ConfirmDialog>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ title }}</p>
			<p class="text--primary">{{ desc }}</p>
        </v-card-text>
	</v-card>
</template>

<script>
import CardOptions from './CardOptions.vue'
import ConfirmDialog from "../ConfirmDialog.vue";

import storage from "../../js/storage.js";
import eventHub from "../../js/eventHub.js";

export default {
    name: "LocationCard",
    components: {
        CardOptions,
		ConfirmDialog,
    },
    props: {
        id: Number,
        title: String,
        desc: String
    },
    data() {
        return {
			showDeleteDialog: false,
        }
    },
    methods: {
		onOptionSelected(value) {
			if (value === "edit") eventHub.$emit('edit', {type: 'note', id: this.id})
			else if (value === "delete") this.showDeleteDialog = true;
		},
		deleteNote() {
			storage.deleteNote(this.id);
		},
    }
};
</script>

<style></style>
