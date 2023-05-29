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
		<div class="text-right search-bar-min-width">
			<v-text-field
				v-model="search"
				:label="$t('status.search')"
				append-inner-icon="mdi-magnify"
				density="comfortable"
				hide-details
				clearable
			/>
		</div>

		<v-divider class="ml-3 mr-1" vertical />

		<DragAndDropModeSelector />

		<v-divider class="ml-3 mr-1" vertical />

		<div>
			<slot name="actions" />
		</div>
	</v-row>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { t as $t } from "@/core/translation";
import { useCampaignInfoStore } from "@/store/campaignInfo";
import { useFilterStore } from "@/store/filter";
import DragAndDropModeSelector from "../content/DragAndDropModeSelector.vue";
import StatusTray from "./StatusTray.vue";

const rules = [
	(v: string) => !!v || $t("fields.requiredField"),
	(v: string) => v.length <= 30 || "30 max.",
];
const editName = ref(false);

const campaignInfoStore = useCampaignInfoStore();
const filterStore = useFilterStore();

const campaignName = computed({
	get() {
		return campaignInfoStore.name;
	},
	set(value) {
		const name = value.trim();
		if (name) campaignInfoStore.name = name;
	},
});

const search = computed({
	get() {
		return filterStore.rules.text;
	},
	set(value) {
		filterStore.rules.text = value?.trim();
	},
});
</script>
<style scoped>
.search-bar-min-width {
	min-width: 300px;
}
</style>
