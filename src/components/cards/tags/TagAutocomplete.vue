<template>
	<v-autocomplete
		v-model="selectedTag"
		:items="availableTags"
		item-title="text"
		item-value="id"
		density="compact"
		autofocus
		return-object
		max-width="30%"
		append-icon="mdi-chevron-right"
		@click:append="open = false"
		@keydown="categoryChangeHotkey"
	>
		<template v-slot:prepend>
			<v-menu location="bottom left">
				<template v-slot:activator="{ props: menuProps }">
					<v-tooltip location="bottom">
						<template v-slot:activator="{ props: tooltipProps }">
							<v-icon v-bind="mergeProps(menuProps, tooltipProps)">{{ icons[category] }}</v-icon>
						</template>
						<span>{{ $t("actions.changeCategory") }}</span>
					</v-tooltip>
				</template>
				<v-list density="compact">
					<v-list-item v-for="cat in categories" :key="cat" link @click="category = cat">
						<v-list-item-title>
							<v-icon size="small" class="mx-1">{{ icons[cat] }}</v-icon>
							{{ $t(`categories.${cat}`) }}
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-autocomplete>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { CardCategory, CardTypes, ID, Tag, Icon as icons } from "@/js/types";
import { useCardsStore } from "@/store/cards";
import { computed, mergeProps, nextTick, ref, watch } from "vue";

const props = defineProps<{
	// Override default v-model
	modelValue: boolean;
	excludeIds?: ID[];
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "select", value: ID): void;
}>();

const cardsStore = useCardsStore();

const category = ref(CardCategory.Quest);
const selectedTag = ref<Tag | undefined>(undefined);

watch(selectedTag, (value) => {
	if (value) {
		emit("select", value.id);
		// HACK: Remove focus on v-autocomplete to allow it to render again and reset selection to clear input field
		(document.activeElement as HTMLElement)?.blur();
		nextTick(() => (selectedTag.value = undefined));
	}
});

/**
 * Change the current category with Ctrl+Left/RightArrow
 */
function categoryChangeHotkey(e: KeyboardEvent) {
	if (e.ctrlKey && e.code === "ArrowLeft") category.value = previousCategory.value;
	else if (e.ctrlKey && e.code === "ArrowRight") category.value = nextCategory.value;
}

const categories = computed(() => CardCategory);
const previousCategory = computed(() => {
	const values = Object.values(categories.value);
	const currentIdx = values.indexOf(category.value);
	const prevIdx = currentIdx === 0 ? values.length - 1 : currentIdx - 1;
	return values[prevIdx];
});
const nextCategory = computed(() => {
	const values = Object.values(categories.value);
	const currentIdx = values.indexOf(category.value);
	const nextIdx = currentIdx === values.length - 1 ? 0 : currentIdx + 1;
	return values[nextIdx];
});
/**
 * Browse the store to create a tag for each card (excluding objects with the specified IDs, if any)
 */
const availableTags = computed<Tag[]>(() => {
	let cards: CardTypes[] = cardsStore.cards[category.value];
	return cards
		.filter((card: CardTypes) => (props.excludeIds ? !props.excludeIds.includes(card.id) : true))
		.map((card: CardTypes) => new Tag(card));
});
/**
 * Overwrite default v-model to bind the v-model attribute to the parent.
 * This allows the parent component to get a 2-way data bind to this component seamlessly.
 * In this case, it is used to control this component's opening state.
 * @see https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model
 */
const open = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
</script>

<style></style>
