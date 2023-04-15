<template>
	<ListPanel :title="$t('fields.tags')" :empty-content-text="$t('fields.noTag')" :is-filled="model.length !== 0">
		<template v-slot:action>
			<v-slide-x-reverse-transition>
				<v-btn v-if="!showAutocomplete" variant="text" density="compact" icon="mdi-plus" @click="showAutocomplete = true"> </v-btn>
				<TagAutocomplete v-else v-model="showAutocomplete" :excludeIds="excludeIds" @select="onSelection" />
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
	// Override default v-model
	modelValue: ID[];
	excludeId?: ID;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: ID[]): void;
}>();

const showAutocomplete = ref(false);

function onSelection(id: ID) {
	if (!props.modelValue.includes(id)) props.modelValue.push(id);
}

const excludeIds = computed(() => {
	if (props.excludeId) return [props.excludeId, ...props.modelValue];
	else return [...props.modelValue];
});

/**
 * Overwrite default v-model to bind the v-model attribute to the parent.
 * This allows the parent component to get a 2-way data bind to this component seamlessly.
 * In this case, it allows the TagListPanel > TagList > TagAutocomplete component chain to propagate any data update to the parent/child components.
 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
 */
const model = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>
