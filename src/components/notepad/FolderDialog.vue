<template>
	<v-dialog v-model="showDialog" persistent max-width="375">
		<FolderForm :parent-path="parentPath" @close="close" @submit="close"></FolderForm>
	</v-dialog>
</template>

<script lang="ts">
import FolderForm from "./FolderForm.vue";

import Vue from "vue";

export default Vue.extend({
	components: {
		FolderForm,
	},
	props: {
		value: Boolean, // Default v-model overwrite
		parentPath: {
			type: String,
			required: true,
		},
	},
	methods: {
		close(): void {
			this.showDialog = false;
		},
	},
	computed: {
		/**
		 * Overwrite default v-model to bind this component's v-model attribute to the v-dialog one.
		 * This allows to use a custom component as an external activator for the v-dialog.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		showDialog: {
			get(): boolean {
				return this.value;
			},
			set(value: boolean): void {
				this.$emit("input", value);
			},
		},
	},
});
</script>

<style></style>
