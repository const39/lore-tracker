<template>
	<v-dialog v-model="showDialog" persistent max-width="375">
		<FolderForm :parent-path="parentPath" @close="close" @submit="close"></FolderForm>
	</v-dialog>
</template>

<script lang="ts" setup>
import FolderForm from "./FolderForm.vue";

import { computed } from "vue";

const props = defineProps<{
	modelValue: boolean; // Default v-model overwrite
	parentPath: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

function close(): void {
	showDialog.value = false;
}

/**
 * Overwrite default v-model to bind this component's v-model attribute to the v-dialog one.
 * This allows to use a custom component as an external activator for the v-dialog.
 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
 */
const showDialog = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>

<style></style>
