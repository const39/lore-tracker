<template>
	<div v-if="breadcrumbs.length > 1" class="d-flex align-center">
		<v-icon icon="mdi-arrow-left" @click="goBack" />
		<v-breadcrumbs :items="breadcrumbs">
			<template #title="{ item, index }">
				<FolderBreadcrumbsItem
					:title="index === 0 ? $t(`categories.${item.category}`) : undefined"
					:folder="item"
				/>
			</template>
			<template #divider>
				<v-icon icon="mdi-chevron-right" />
			</template>
		</v-breadcrumbs>
	</div>
</template>

<script lang="ts" setup>
import { useRepo } from "pinia-orm";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Folder, LoreEntry } from "@/core/models";
import { FolderRepo } from "@/core/repositories";
import { t as $t } from "@/core/translation";
import FolderBreadcrumbsItem from "./FolderBreadcrumbsItem.vue";

const props = defineProps<{
	folder: Folder<LoreEntry>;
}>();

const router = useRouter();
const folderRepo = useRepo(FolderRepo);

const breadcrumbs = computed(() => folderRepo.getHierarchy(props.folder));

function goBack() {
	router.back();
}
</script>
