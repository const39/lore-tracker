<template>
	<template v-if="currentCampaign">
		<Banner>
			<template #actions>
				<LorebookActions />
			</template>
		</Banner>

		<v-row>
			<v-slide-x-transition mode="in-out">
				<v-col v-if="currentFolder && sidePanel.isOpen" v-bind="cols">
					<SidePanel :current-folder="currentFolder" />
				</v-col>
			</v-slide-x-transition>
			<v-col cols="">
				<LayoutTabs
					:campaign="currentCampaign"
					:category="category"
					:current-folder="currentFolder"
				/>
			</v-col>
		</v-row>

		<!-- Quick note - Floating expanding text area -->
		<div class="ma-4 quick-note-wrapper">
			<QuickNote :campaign="currentCampaign" />
		</div>
	</template>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import QuickNote from "@/components/global/QuickNote.vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import { Category } from "@/core/models";
import { CampaignRepo, FolderRepo } from "@/core/repositories";
import { UUID } from "@/core/utils/types";
import { useSidePanel } from "@/store/sidePanel";
import LayoutTabs from "@/views/LoreBook/content/LayoutTabs.vue";
import SidePanel from "@/views/LoreBook/content/SidePanel.vue";

const props = defineProps<{ campaignId: UUID; category: Category; folderId?: UUID }>();

const campaignRepo = useRepo(CampaignRepo);
const folderRepo = useRepo(FolderRepo);

const sidePanel = useSidePanel();

const cols = computed(() => {
	const base = sidePanel.state?.status === "file-form" ? 4 : 3;
	return { xs: 12, sm: 12, md: 12, lg: base };
});

const currentCampaign = computed(() => {
	return campaignRepo.find(props.campaignId);
});

// Current folder is either:
// - the folder with the specified ID
// - the current category's root folder if no ID is given
const currentFolder = computed(() => {
	// Load the folder with its relations to enable Vue to track changes to its files/subfolders and re-run this computed property
	return props.folderId
		? folderRepo.getFolder(props.folderId, props.category, { withRelations: true })
		: folderRepo.getRootFolder(props.category, { withRelations: true });
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
