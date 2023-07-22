<template>
	<v-text-field
		v-model="textInput"
		:label="$t('status.search')"
		append-inner-icon="mdi-magnify"
		density="comfortable"
		hide-details
		clearable
	/>
</template>
<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";
import { computed } from "vue";
import { t as $t } from "@/core/translation";
import { useFilterStore } from "@/store/filter";

const filterStore = useFilterStore();

// Update actual filter rule 500ms after the user stopped typing
const updateFilterRule = useDebounceFn((value?: string) => {
	filterStore.rules.text = value?.trim();
}, 500);

const textInput = computed({
	get() {
		return filterStore.rules.text;
	},
	set(value) {
		updateFilterRule(value);
	},
});
</script>
