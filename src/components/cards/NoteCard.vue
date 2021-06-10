<template>
	<v-card class="mb-4">
		<v-card-actions class="float-right">
			<CardOptions @option-selected="onOptionSelected"></CardOptions>
			<NoteForm v-model="showEditDialog" edit :id="id"></NoteForm>
		</v-card-actions>
		<v-card-text class="pa-3">
			<p class="text-h6 text--primary">{{ title }}</p>
			<p class="text--primary">{{ desc }}</p>
        </v-card-text>
	</v-card>
</template>

<script>
import NoteForm from '../forms/NoteForm.vue'
import CardOptions from './CardOptions.vue'

export default {
    name: "LocationCard",
    components: {
        CardOptions,
        NoteForm
    },
    props: {
        id: Number,
        title: String,
        desc: String
    },
    data() {
        return {
            showEditDialog: false
        }
    },
    methods: {
		onOptionSelected(value) {
			if (value === "edit") this.showEditDialog = true;
			// else if (value === "delete") console.log('delete');
		},
    }
};
</script>

<style></style>
