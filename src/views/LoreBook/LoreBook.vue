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
					<FolderTree
						v-if="status === 'folder-tree'"
						:category="getCategory(sidePanelStore.fileTreeState.itemToMove)"
					/>
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
import FolderTree from "@/components/cards/folder/FolderTree.vue";
import LorebookActions from "@/components/layout/banner/actions/LorebookActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import { isCard, isCardFolder, type CardTypes, type CardFolder } from "@/core/model/cards";
import { useSidePanel } from "@/store/sidePanel";

const sidePanelStore = useSidePanel();

const status = computed(() => sidePanelStore.sidePanelStatus);

function getCategory(arg: CardTypes | CardFolder | undefined) {
	if (isCardFolder(arg)) return arg.metadata._category;
	if (isCard(arg)) return arg._category;
	return undefined;
}
</script>

<style scoped>
.sticky-form {
	position: sticky;
	top: 78px;
}
</style>
