<template>
	<Banner>
		<template #actions>
			<LorebookActions />
		</template>
	</Banner>

	<v-row>
		<v-slide-x-transition mode="in-out">
			<v-col v-show="status !== 'closed'" :cols="status === 'form' ? 4 : 3">
				<v-card class="pa-2 border sticky" variant="outlined">
					<FormWrapper v-if="status === 'form'" />
					<template v-if="status === 'folder-tree'">
						<FolderTreeNavVariant
							v-if="sidePanelStore.folderTreeState.variant === 'nav'"
						/>
						<FolderTreeMoveVariant
							v-if="sidePanelStore.folderTreeState.variant === 'card-move'"
						/>
					</template>
				</v-card>
			</v-col>
		</v-slide-x-transition>
		<v-col cols="">
			<router-view />
		</v-col>
	</v-row>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import FormWrapper from "@/components/cards/files/forms/FormWrapper.vue";
import FolderTreeMoveVariant from "@/components/cards/folder/tree/FolderTreeMoveVariant.vue";
import FolderTreeNavVariant from "@/components/cards/folder/tree/FolderTreeNavVariant.vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import { useSidePanel } from "@/store/sidePanel";

const sidePanelStore = useSidePanel();

const status = computed(() => sidePanelStore.sidePanelStatus);
</script>

<style scoped>
.sticky {
	position: sticky;
	top: 78px;
}
</style>
