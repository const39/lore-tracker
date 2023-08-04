<template>
	<div class="my-3">
		<div class="mb-4 d-flex align-center text-h6">
			<span class="mr-2 mb-1">
				<v-progress-circular v-if="loading" color="primary" size="small" indeterminate />
				<v-badge v-else :content="list.length" color="grey" inline />
			</span>
			<span class="px-1"> {{ title }} </span>
			<slot name="actions" />
		</div>
		<v-item-group v-if="!loading" v-model="selected" multiple>
			<!-- the <draggable> component only controls the 'sort' drag&drop mode -->
			<draggable
				v-model="list"
				:animation="200"
				:disabled="!sortEnabled"
				:group="group"
				tag="v-row"
				draggable=".draggable-item"
				item-key="id"
				@start="drag = true"
				@end="swap"
			>
				<!-- v-col MUST have "position: relative" to prevent the card's custom drag image to by included in its size -->
				<template #item="{ element }">
					<v-col class="draggable-item relative" cols="12" v-bind="density">
						<v-item v-slot="{ isSelected, toggle, select }" :value="element">
							<slot
								v-bind="{
									itemData: element,
									isDraggable: isSelected || sortEnabled,
									isSelected: isSelected,
									toggle,
									select,
								}"
							/>
						</v-item>
					</v-col>
				</template>
			</draggable>
		</v-item-group>
	</div>
</template>

<script setup lang="ts" generic="T extends Indexable & Orderable & Describable">
import { onKeyStroke, onKeyUp } from "@vueuse/core";
import { computed, ref } from "vue";
import draggable from "vuedraggable";
import { useGridDensity } from "@/composables/gridDensity";
import { Describable, Indexable, Orderable } from "@/core/models";
import { usePreferencesStore } from "@/store/preferences";

const props = defineProps<{
	items: T[];
	title: string;
	group: string;
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: "sort", movedItems: T[]): void;
}>();

const selected = defineModel<T[]>("selected", { required: true }); // v-model:selected

const drag = ref(false);

const sortEnabled = ref(false);

const prefStore = usePreferencesStore();
const { density } = useGridDensity();

const list = computed({
	get() {
		const comparator =
			prefStore.cardsOrder === "alphanumeric"
				? getAlphanumericComparator()
				: getPositionComparator();
		// Make a shallow copy of the list and sort it
		return [...props.items].sort(comparator);
	},
	set() {
		// Left empty to allow list to be mutated without emitting the mutation itself to the parent.
		// Instead, the 'sort' event is sent to the parent. See onDrop().
	},
});

/**
 * Swap the position of two elements after a drop event.
 * @param e the drop event
 */
function swap(e: { oldIndex: number; newIndex: number }) {
	// Get the elements
	const sourceItem = list.value[e.oldIndex];
	const targetItem = list.value[e.newIndex];

	// Swap their position (only update their 'position' field, not their actual place in the array: vue-draggable performs that itself)
	sourceItem.position = e.newIndex;
	targetItem.position = e.oldIndex;

	// Emit 'sort' event to parent with the updated items
	emit("sort", [sourceItem, targetItem]);
	// Finish drag & drop operation
	drag.value = false;
}

/**
 * Returns a comparator function that sorts items in the alphanumeric order of their text.
 */
function getAlphanumericComparator() {
	return (a: T, b: T) => {
		const textA = a.getText().toLowerCase();
		const textB = b.getText().toLowerCase();
		return textA.localeCompare(textB);
	};
}

/**
 * Returns a comparator function that sorts items in the descending order of their 'position' field (latest first).
 */
function getPositionComparator() {
	return (a: T, b: T) => {
		return b.position - a.position; // DESC order: 0 = oldest, highest = latest
	};
}

onKeyStroke(
	["Control", "Alt"],
	(e: KeyboardEvent) => {
		// Enable 'sort' mode on Ctrl+Alt hold
		if (e.ctrlKey && e.altKey) sortEnabled.value = true;
	},
	{ dedupe: true } // Fire event once on hold, instead of at each tick
);

// Disable when key is released
onKeyUp(["Control", "Alt"], () => (sortEnabled.value = false));
</script>

<style scoped>
.relative {
	position: relative;
}
</style>
