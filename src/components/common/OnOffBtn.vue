<template>
	<v-btn :icon="icon" @click="state = !state" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
	modelValue: boolean;
	onIcon?: string;
	offIcon?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

const state = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

const icon = computed(() => (state.value ? props.onIcon : props.offIcon));
</script>
