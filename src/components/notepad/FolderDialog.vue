<template>
	<v-dialog v-model="showDialog" max-width="375" persistent>
		<FolderForm :parent="parent" @close="close" @submit="close" />
	</v-dialog>
</template>

<script lang="ts" setup>
import { Folder } from "@/js/model/fileTree";
import FolderForm from "./FolderForm.vue";

import { computed } from "vue";

const props = defineProps<{
	modelValue: boolean; // v-model
	parent: Folder;
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
