<template>
	<ListPanel
		:title="$t('fields.tags')"
		:empty-content-text="$t('fields.noTag')"
		:is-filled="model.length !== 0"
	>
		<template #action>
			<v-slide-x-reverse-transition>
				<v-btn
					v-if="!showAutocomplete"
					variant="text"
					density="compact"
					icon="mdi-plus"
					@click="showAutocomplete = true"
				/>
				<TagAutocomplete
					v-else
					v-model="showAutocomplete"
					:exclude-ids="excludeIds"
					@select="onSelection"
				/>
			</v-slide-x-reverse-transition>
		</template>
		<TagList v-model="model" editable />
	</ListPanel>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { ref, computed } from "vue";
import { ID } from "@/js/types";

import ListPanel from "@/components/ListPanel.vue";
import TagList from "./TagList.vue";
import TagAutocomplete from "./TagAutocomplete.vue";

const props = defineProps<{
	modelValue: ID[]; // v-model
	excludeId?: ID;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: ID[]): void;
}>();

const showAutocomplete = ref(false);

// v-model binding
const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

function onSelection(id: ID) {
	if (!model.value.includes(id)) model.value.push(id);
}

const excludeIds = computed(() => {
	if (props.excludeId) return [props.excludeId, ...model.value];
	else return [...model.value];
});
</script>
