<template>
	<div class="sticky">
		<v-card class="pa-2 border fixed-height" variant="outlined">
			<!-- Type casts are necessary because of https://github.com/vuejs/core/issues/2981 -->
			<template v-if="state?.status === 'file-form'">
				<LoreEntryForm
					v-bind="{ variant: state.variant, baseModel: state.baseModel as LoreEntry }"
					@submit="close"
					@close="close"
				/>
			</template>
			<template v-if="state?.status === 'folder-form'">
				<FolderForm
					v-bind="{ variant: state.variant, baseModel: state.baseModel as Folder }"
					@submit="close"
					@close="close"
				/>
			</template>
			<template v-if="state?.status === 'folder-tree'">
				<FolderTreeNavVariant
					v-if="state.variant === 'nav'"
					:campaign="campaign"
					:current-folder="currentFolder"
					@submit="close"
					@close="close"
				/>
				<FolderTreeMoveVariant
					v-if="state.variant === 'card-move'"
					v-bind="{ itemToMove: state.itemToMove as Folder | LoreEntry, campaign, currentFolder }"
					@submit="close"
					@close="close"
				/>
			</template>
			<template v-if="state?.status === 'related-cards'">
				<RelatedCards
					v-bind="{ relatedTo: state.relatedTo as Folder | LoreEntry }"
					@submit="close"
					@close="close"
				/>
			</template>
		</v-card>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import LoreEntryForm from "@/components/cards/files/LoreEntryForm.vue";
import FolderForm from "@/components/cards/folder/FolderForm.vue";
import { Campaign, Folder, LoreEntry } from "@/core/models";
import { useSidePanel } from "@/store/sidePanel";
import FolderTreeMoveVariant from "./folder-tree/FolderTreeMoveVariant.vue";
import FolderTreeNavVariant from "./folder-tree/FolderTreeNavVariant.vue";
import RelatedCards from "./related-cards/RelatedCards.vue";

defineProps<{
	campaign: Campaign;
	currentFolder: Folder;
}>();

const sidePanelStore = useSidePanel();

const state = computed(() => sidePanelStore.state);

function close() {
	sidePanelStore.close();
}
</script>

<style scoped>
.sticky {
	position: sticky;
	top: 78px;
}
.fixed-height {
	max-height: 85vh;
	overflow-y: auto;
}
</style>
