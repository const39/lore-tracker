<template>
	<v-row class="my-3 d-flex align-center">
		<div>
			<v-hover v-slot="{ isHovering, props }">
				<div class="text-xl-h4 mb-2" v-bind="props">
					<v-form v-if="editName">
						<v-text-field
							v-model="campaignName"
							:rules="rules"
							maxlength="30"
							append-inner-icon="mdi-check"
							autofocus
							counter
							@click:append-inner="editName = false"
							@keypress.enter="editName = false"
						/>
					</v-form>
					<span v-else>
						{{ campaignName }}
						<v-icon
							v-show="isHovering"
							size="x-small"
							icon="mdi-pencil"
							@click="editName = true"
						/>
					</span>
				</div>
			</v-hover>

			<StatusTray />
		</div>
		<v-spacer />
		<div class="text-right">
			<SearchView class="mt-1 mb-2" />
			<span class="text-grey text-caption">{{ cardCount + $t("status.cardCount") }}</span>
			<v-switch
				v-model="dragAndDropSortState"
				:disabled="!canDragAndDropBeEnabled"
				:label="$t('actions.cardDragndrop')"
				color="primary"
				density="compact"
				hide-details
			/>
		</div>

		<v-divider class="ml-3 mr-1" vertical />
		<div>
			<slot name="actions" />
		</div>
	</v-row>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import SearchView from "@/components/global/SearchView.vue";
import { t as $t } from "@/core/translation";
import { useCampaignInfoStore } from "@/store/campaignInfo";
import { useCardsStore } from "@/store/cards";
import { useFilterStore } from "@/store/filter";
import { usePreferencesStore } from "@/store/preferences";
import StatusTray from "./StatusTray.vue";

const rules = [
	(v: string) => !!v || $t("fields.requiredField"),
	(v: string) => v.length <= 30 || "30 max.",
];
const editName = ref(false);

const filterStore = useFilterStore();
const prefStore = usePreferencesStore();
const cardsStore = useCardsStore();
const campaignInfoStore = useCampaignInfoStore();

const cardCount = computed(() => cardsStore.cardCount);

const campaignName = computed({
	get() {
		return campaignInfoStore.name;
	},
	set(value) {
		const name = value.trim();
		if (name) campaignInfoStore.name = name;
	},
});

// Disable drag and drop 'sort' mode switch if:
// - Cards are sorted automatically (i.e. not in custom order)
// - Drag&drop is not already enabled in another mode
// - A search filter is active
const canDragAndDropBeEnabled = computed(
	() =>
		prefStore.cardsOrder !== "alphanumeric" &&
		prefStore.dragAndDropMode !== "drop" &&
		!filterStore.isFilterActive
);

// Boolean computed property indicating if drag and drop is in 'sort' mode
const dragAndDropSortState = computed({
	get() {
		return prefStore.dragAndDropMode === "sort";
	},
	set(value) {
		prefStore.dragAndDropMode = value && canDragAndDropBeEnabled.value ? "sort" : "disabled";
	},
});
</script>
