<template>
	<v-row class="my-3 d-flex align-center">
		<div>
			<v-hover v-slot="{ isHovering, props }">
				<div class="text-xl-h4 mb-2" v-bind="props">
					<v-form v-if="editName" @submit.prevent="editName = false">
						<v-text-field
							v-model="campaignName"
							:rules="rules"
							class="campaign-name-field min-width"
							maxlength="30"
							append-inner-icon="mdi-check"
							autofocus
							counter
							@click:append-inner="updateName"
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

			<StatusTray v-model:day="campaign.days" v-model:season="campaign.season" />
		</div>
		<v-spacer />
		<div class="text-right search-bar min-width">
			<SearchBar />
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
import { useRepo } from "pinia-orm";
import { ref, watch } from "vue";
import { Campaign } from "@/core/models";
import { CampaignRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import DragAndDropModeSelector from "./actions/DragAndDropModeSelector.vue";
import SearchBar from "./actions/SearchBar.vue";
import StatusTray from "./StatusTray.vue";

const rules = [
	(v: string) => !!v || $t("fields.requiredField"),
	(v: string) => v.length <= 30 || "30 max.",
];
const editName = ref(false);

const campaignRepo = useRepo(CampaignRepo);

const campaign = ref<Campaign>(campaignRepo.getCurrentCampaign());

// eslint-disable-next-line vue/no-ref-object-destructure
const campaignName = ref(campaign.value.name); // Intended separate ref for the name to validate input before committing the change (see updateName())

watch(
	campaign,
	(newCampaign) => {
		campaignRepo.update(newCampaign);
	},
	{ deep: true }
);

function updateName() {
	// Update name if it is not empty
	const name = campaignName.value.trim();
	if (name) campaign.value.name = name;
	// Close edit field
	editName.value = true;
}
</script>

<style scoped>
.campaign-name-field.min-width {
	min-width: 300px;
}

.search-bar.min-width {
	min-width: 300px;
}
</style>
