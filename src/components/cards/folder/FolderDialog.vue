<template>
	<v-dialog v-model="showDialog" max-width="375" persistent>
		<FolderForm @close="close" @submit="close" />
	</v-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import FolderForm from "./FolderForm.vue";

const props = defineProps<{
	modelValue: boolean; // v-model
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

// v-model binding
const showDialog = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

function close(): void {
	showDialog.value = false;
}
</script>
