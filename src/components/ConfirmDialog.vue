<template>
	<v-dialog v-model="showDialog" max-width="375" persistent>
		<v-card>
			<v-card-title class="text-h5">
				{{ title }}
			</v-card-title>
			<v-card-text class="text-body-2">
				{{ message }}
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" color="primary" @click="cancel">
					{{ $t("actions.no") }}
				</v-btn>
				<v-btn variant="text" @click="accept">
					{{ $t("actions.yes") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { t as $t } from "@/js/translation";

const props = defineProps<{
	modelValue: boolean; // Default v-model overwrite
	title: string;
	message: string;
	acceptAction?: () => void;
	cancelAction?: () => void;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

/**
 * Overwrite default v-model to bind the QuestForm v-model attribute to the v-dialog one.
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

function cancel(): void {
	props.cancelAction?.();
	showDialog.value = false;
}
function accept(): void {
	props.acceptAction?.();
	showDialog.value = false;
}
</script>
