<template>
	<v-dialog v-model="showDialog" max-width="375" persistent>
		<FolderForm :parent="parent" @close="close" @submit="close" />
	</v-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { CardFolder } from "@/core/model/cards";
import FolderForm from "./FolderForm.vue";

const props = defineProps<{
	modelValue: boolean; // v-model
	parent: CardFolder;
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
