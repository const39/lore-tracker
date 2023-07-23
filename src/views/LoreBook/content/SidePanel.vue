<template>
	<v-card class="pa-2 border sticky" variant="outlined">
		<!-- Type casts are necessary because of https://github.com/vuejs/core/issues/2981 -->
		<template v-if="state?.status === 'file-form'">
			<FormWrapper
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
			<FolderTreeNavVariant v-if="state.variant === 'nav'" :current-folder="currentFolder" @submit="close" @close="close" />
			<FolderTreeMoveVariant
				v-if="state.variant === 'card-move'"
				v-bind="{ itemToMove: state.itemToMove as Folder | LoreEntry, currentFolder }"
				@submit="close"
				@close="close"
			/>
		</template>
	</v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import FormWrapper from "@/components/cards/files/forms/FormWrapper.vue";
import FolderForm from "@/components/cards/folder/FolderForm.vue";
import FolderTreeMoveVariant from "@/components/cards/folder/tree/FolderTreeMoveVariant.vue";
import FolderTreeNavVariant from "@/components/cards/folder/tree/FolderTreeNavVariant.vue";
import { Folder, LoreEntry } from "@/core/models";
import { useSidePanel } from "@/store/sidePanel";

defineProps<{
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
</style>
