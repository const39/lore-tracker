<template>
	<v-dialog v-model="showDialog" persistent max-width="375">
		<v-card>
			<v-card-title class="text-h5">{{ title }}</v-card-title>
			<v-card-text class="text-body-2 text--primary">{{ message }}</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="cancel">{{ $t("actions.no") }}</v-btn>
				<v-btn text class="text--primary" @click="accept">{{ $t("actions.yes") }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
	props: {
		value: Boolean, // Default v-model overwrite
		title: String,
		message: String,
		acceptAction: Function as PropType<() => void>,
		cancelAction: Function as PropType<() => void>,
	},
	methods: {
		cancel(): void {
			if (this.cancelAction) this.cancelAction();
			this.showDialog = false;
		},
		accept(): void {
			if (this.acceptAction) this.acceptAction();
			this.showDialog = false;
		},
	},
	computed: {
		/**
		 * Overwrite default v-model to bind the ObjectiveForm v-model attribute to the v-dialog one.
		 * This allows to use a custom component as an external activator for the v-dialog.
		 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
		 */
		showDialog: {
			get() {
				return this.value;
			},
			set(value): void {
				this.$emit("input", value);
			},
		},
	},
});
</script>

<style></style>
