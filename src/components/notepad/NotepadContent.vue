<template>
	<v-container>
		<div class="d-flex" v-if="breadcrumbs.length">
			<v-icon @click="goBack">mdi-arrow-left</v-icon>
			<v-breadcrumbs :items="breadcrumbs">
				<template v-slot:divider>
					<v-icon>mdi-chevron-right</v-icon>
				</template>
			</v-breadcrumbs>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">
				{{ $t("notepad.types.folder") + "s" }}
			</div>
			<v-row>
				<v-col cols="12" md="3" v-for="folder in folderContent?.folders" :key="folder.id">
					<FolderCard
						:folder="folder"
						:parent-path="folderPath"
						@open-folder="openFolder(folder)"
					></FolderCard>
				</v-col>
			</v-row>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">{{ $t("notepad.types.file") + "s" }}</div>
			<!-- <LayoutTabContent :category="noteCategory" /> -->
			<v-row>
				<v-col cols="12" md="3" v-for="file in folderContent?.files" :key="file.id">
					<CardContainer :item-data="file"></CardContainer>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed } from "vue";

import FolderCard from "./FolderCard.vue";
// import LayoutTabContent from "./layouts/LayoutTabContent.vue";
import CardContainer from "@/components/cards/CardContainer.vue";

import { CardCategory, Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";
import { useNotepadStore } from "@/store/notepad";
import { useRouter } from "vue-router";

interface BreadcrumbItem {
	text: string;
	to: {
		name: string;
		params?: object;
	};
	disabled?: boolean;
	exact: true;
}

const props = defineProps<{
	routeName: string;
	folderPath: string;
}>();

const router = useRouter();
const notepadStore = useNotepadStore();

function goBack() {
	router.back();
}
function openFolder(folder: Folder) {
	router.push({
		name: props.routeName,
		params: { folderPath: utilities.joinPaths(false, props.folderPath, folder.name.toLowerCase()) },
	});
}
function getChildrenCount(folder: Folder) {
	const fullPath = utilities.joinPaths(true, props.folderPath, folder.name);
	const content = notepadStore.getFolderContent(fullPath);
	return content ? content.folders.length + content.folders.length : 0;
}

const noteCategory = computed(() => {
	return CardCategory.Note;
});

const folderIcon = computed(() => {
	return Icon.folder;
});

const folderContent = computed(() => {
	const sanitized = utilities.sanitizePath(true, props.folderPath);
	return notepadStore.getFolderContent(sanitized);
});

const breadcrumbs = computed(() => {
	const splitPath = props.folderPath.split("/").filter((e) => e.length > 0);
	if (splitPath.length < 1) return [];

	const root: BreadcrumbItem = {
		text: $t("pages.notepad"),
		to: { name: props.routeName },
		disabled: false,
		exact: true,
	};

	const nextItems: BreadcrumbItem[] = splitPath.map((pathElement, idx, arr) => {
		const pathToCurrentElement = arr.slice(0, idx + 1).join("/");
		return {
			text: pathElement,
			to: { name: props.routeName, params: { folderPath: pathToCurrentElement } },
			disabled: idx === arr.length - 1,
			exact: true,
		};
	});

	return [root, ...nextItems];
});
</script>

<style></style>
