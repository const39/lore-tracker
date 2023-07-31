<template>
	<template v-if="currentCampaign">
		<Banner v-model="currentCampaign">
			<template #actions>
				<LorebookActions />
			</template>
		</Banner>

		<v-row>
			<v-slide-x-transition mode="in-out">
				<v-col v-if="currentFolder && sidePanel.isOpen" v-bind="cols">
					<SidePanel :campaign="currentCampaign" :current-folder="currentFolder" />
				</v-col>
			</v-slide-x-transition>
			<v-col cols="">
				<LayoutTabs
					:campaign="currentCampaign"
					:category="category"
					:folder="currentFolder"
				/>
			</v-col>
		</v-row>

		<!-- Quick note - Floating expanding text area -->
		<div class="ma-4 quick-note-wrapper">
			<QuickNote :campaign="currentCampaign" />
		</div>
	</template>
	<!-- Display alert in case campaign does not exist -->
	<v-alert
		v-else
		:title="$t('messages.errors.campaign.campaignNotFound.title')"
		type="error"
		variant="tonal"
	>
		<router-link :to="{ name: 'Campaigns' }">
			{{ $t("messages.errors.campaign.campaignNotFound.action") }}
		</router-link>
	</v-alert>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import QuickNote from "@/components/global/QuickNote.vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import { Category } from "@/core/models";
import { CampaignRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import { UUID } from "@/core/utils/types";
import { useFilterStore } from "@/store/filter";
import { useSidePanel } from "@/store/sidePanel";
import LayoutTabs from "@/views/LoreBook/content/LayoutTabs.vue";
import SidePanel from "@/views/LoreBook/content/SidePanel.vue";

const props = defineProps<{ campaignId: UUID; category: Category; folderId?: UUID }>();

const campaignRepo = useRepo(CampaignRepo);

const filterStore = useFilterStore();
const sidePanel = useSidePanel();

const cols = computed(() => {
	const base = sidePanel.state?.status === "file-form" ? 4 : 3;
	return { xs: 12, sm: 12, md: 12, lg: base };
});

const currentCampaign = computed({
	get() {
		return campaignRepo.getCampaign(props.campaignId);
	},
	set(newCampaign) {
		if (newCampaign) campaignRepo.update(newCampaign);
	},
});

// Current folder is either:
// - the folder with the specified ID
// - the current category's root folder if no ID is given
const currentFolder = computed(() => {
	if (currentCampaign.value) {
		// Load the folder with its relations to enable Vue to track changes to its files/subfolders and re-run this computed property
		const options = { withRelations: true };
		return props.folderId
			? campaignRepo.getFolder(currentCampaign.value, props.folderId, props.category, options)
			: campaignRepo.getRootFolder(currentCampaign.value, props.category, options);
	}
	return undefined;
});

// Clear the filter when leaving the lore book of the current campaign
onBeforeRouteLeave(() => {
	filterStore.$reset();
});
</script>
<style scoped>
.quick-note-wrapper {
	position: fixed;
	bottom: 0;
	right: 0;
	z-index: 5;
}
</style>
