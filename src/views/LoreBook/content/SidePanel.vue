<template>
	<v-card class="pa-2 border sticky" variant="outlined">
		<template v-if="state?.status === 'file-form'">
			<FormWrapper
				v-bind="{ variant: state.variant, ...state.data }"
				@submit="close"
				@close="close"
			/>
		</template>
		<template v-if="state?.status === 'folder-form'">
			<FolderForm
				v-bind="{ variant: state.variant, ...state.data }"
				@submit="close"
				@close="close"
			/>
		</template>
		<template v-if="state?.status === 'folder-tree'">
			<FolderTreeNavVariant v-if="state.variant === 'nav'" @submit="close" @close="close" />
			<FolderTreeMoveVariant
				v-if="state.variant === 'card-move'"
				v-bind="state.data"
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
import { useSidePanel } from "@/store/sidePanel";

const sidePanelStore = useSidePanel();

const state = computed(() => sidePanelStore.state);

function close() {
	sidePanelStore.close();
}
</script>
