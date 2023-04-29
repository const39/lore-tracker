<template>
	<v-container>
		<div v-if="breadcrumbs.length" class="d-flex">
			<v-icon icon="mdi-arrow-left" @click="goBack" />
			<v-breadcrumbs :items="breadcrumbs">
				<template #divider>
					<v-icon icon="mdi-chevron-right" />
				</template>
			</v-breadcrumbs>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">
				{{ $t("notepad.types.folder") + "s" }}
			</div>
			<v-row>
				<v-col
					v-for="subfolder in folder.subfolders"
					:key="subfolder.metadata.id"
					cols="12"
					md="3"
				>
					<FolderCard :folder="subfolder" @open-folder="openFolder(subfolder)" />
				</v-col>
			</v-row>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">
				{{ $t("notepad.types.file") + "s" }}
			</div>
			<v-row>
				<v-col v-for="file in folder.files" :key="file.id" cols="12" md="3">
					<CardContainer :item-data="file" />
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import CardContainer from "@/components/cards/CardContainer.vue";
import { Folder, Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import FolderCard from "./FolderCard.vue";

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
	folder: Folder;
}>();

const router = useRouter();

function goBack() {
	router.back();
}

function openFolder(folder: Folder) {
	const path = new Path(props.folder.path, folder.metadata.name.toLowerCase());
	router.push({
		name: "Notepad",
		params: {
			folderURI: [...path.rawSegments], // Use spread syntax to convert readonly array to mutable one (typing issue only)
		},
	});
}

const breadcrumbs = computed(() => {
	if (props.folder.path.isRoot()) return [];

	const segments = props.folder.path.rawSegments;
	const root: BreadcrumbItem = {
		text: $t("pages.notepad"),
		to: { name: "Notepad" },
		disabled: false,
		exact: true,
	};

	const nextItems: BreadcrumbItem[] = segments.map((pathElement, idx, arr) => {
		const pathToCurrentElement = arr.slice(0, idx + 1).join("/");
		return {
			text: pathElement,
			to: {
				name: "Notepad",
				params: { folderURI: pathToCurrentElement },
			},
			disabled: idx === arr.length - 1,
			exact: true,
		};
	});

	return [root, ...nextItems];
});
</script>
