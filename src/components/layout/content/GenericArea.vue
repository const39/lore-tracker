<template>
	<div class="my-3">
		<div class="mb-4 d-flex align-center text-h6">
			<span class="mr-2 mb-1">
				<v-progress-circular v-if="loading" color="primary" size="small" indeterminate />
				<v-badge v-else :content="items.length" color="grey" inline />
			</span>
			<span class=""> {{ title }} </span>
			<slot name="actions" />
		</div>
		<!-- the <draggable> component only controls the 'sort' drag&drop mode -->
		<draggable
			v-if="!loading"
			v-model="items"
			:animation="200"
			:disabled="prefStore.dragAndDropMode !== 'sort'"
			:group="group"
			tag="v-row"
			draggable=".draggable-item"
			item-key="id"
			@start="drag = true"
			@end="drag = false"
		>
			<template #item="{ element }">
				<v-col class="draggable-item" cols="12" v-bind="density">
					<!-- Card is draggable if drag&drop is either in 'drag' or 'sort' mode -->
					<slot
						v-bind="{
							isDraggable: prefStore.dragAndDropMode !== 'disabled',
							itemData: element,
						}"
					/>
				</v-col>
			</template>
		</draggable>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import { useGridDensity } from "@/composables/gridDensity";
import { CardFolder, CardTypes, getText } from "@/core/model/cards";
import { usePreferencesStore } from "@/store/preferences";

const props = defineProps<{
	modelValue: CardTypes[] | CardFolder[];
	title: string;
	group: string;
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const drag = ref(false);

const prefStore = usePreferencesStore();
const { density } = useGridDensity();

const items = computed({
	get() {
		const items = props.modelValue;
		if (prefStore.cardsOrder === "alphanumeric")
			// Sort the shallow copy of the files list in the alphanumeric order
			return [...items].sort((a, b) => {
				const textA = getText(a).toLowerCase();
				const textB = getText(b).toLowerCase();
				return textA.localeCompare(textB);
			}) as typeof items;
		else return items;
	},
	set(list) {
		emit("update:modelValue", list);
	},
});
</script>
