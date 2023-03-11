<template>
	<BaseCard
		:with-options="!showForm"
		:outlined="outlined"
		:id="itemData.id + '-card'"
		@edit="showForm = true"
		@delete="onDelete"
	>
		<v-expand-transition>
			<!-- Dynamic Form component -->
			<component
				v-if="showForm"
				:is="formComponent"
				:category="itemData._category"
				:edit="itemData.id"
				@close="showForm = false"
			/>
			<!-- Dynamic Card content component -->
			<component v-else :is="contentComponent" :class="{ draggable: !isSortDisabled }" :item-data="itemData" />
		</v-expand-transition>
	</BaseCard>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { CardTypes } from "@/js/types";
import { useEventHub, CardEvent } from "@/js/eventHub";

import BaseCard from "./BaseCard.vue";

import ContentQuest from "./content/ContentQuest.vue";
import ContentEvent from "./content/ContentEvent.vue";
import ContentLocation from "./content/ContentLocation.vue";
import ContentCharacter from "./content/ContentCharacter.vue";
import ContentFaction from "./content/ContentFaction.vue";
import ContentNote from "./content/ContentNote.vue";

import FormQuest from "./forms/FormQuest.vue";
import FormEvent from "./forms/FormEvent.vue";
import FormLocation from "./forms/FormLocation.vue";
import FormCharacter from "./forms/FormCharacter.vue";
import FormFaction from "./forms/FormFaction.vue";
import FormNote from "./forms/FormNote.vue";
import utilities from "@/js/utilities";
import { useStore } from "@/store";

const props = defineProps<{ itemData: CardTypes; outlined?: boolean }>();

const showForm = ref(false);
const showContent = ref(true);

const eventHub = useEventHub();
const store = useStore();

function onDelete() {
	eventHub.emit(CardEvent.ID, new CardEvent(props.itemData));
}

const contentComponent = computed(() => {
	return `Content${utilities.capitalize(props.itemData._category)}`;
});
const formComponent = computed(() => {
	return `Form${utilities.capitalize(props.itemData._category)}`;
});
const isSortDisabled = computed(() => {
	return store.isFilterActive || !store.isDefaultOrder;
});
</script>

<style></style>
