<template>
	<div v-if="breadcrumbs.length > 1" class="d-flex align-center">
		<v-icon icon="mdi-arrow-left" @click="goBack" />
		<v-breadcrumbs :items="breadcrumbs">
			<template #title="{ item, index }">
				<FolderBreadcrumbsItem
					:title="index === 0 ? $t(`categories.${item.metadata._category}`) : undefined"
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
import { computed } from "vue";
import { useRouter } from "vue-router";
import { CardFolder } from "@/core/model/cards";
import { t as $t } from "@/core/translation";
import FolderBreadcrumbsItem from "./FolderBreadcrumbsItem.vue";

const props = defineProps<{
	currentFolder: CardFolder;
}>();

const router = useRouter();

const breadcrumbs = computed(() => props.currentFolder.getHierarchy());

function goBack() {
	router.back();
}
</script>
