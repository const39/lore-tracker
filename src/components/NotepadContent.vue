<template>
	<v-container>
		<!-- TODO add "go back" button in breadcrumbs -->
		<v-breadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs">
			<template v-slot:divider>
				<v-icon>mdi-chevron-right</v-icon>
			</template>
		</v-breadcrumbs>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">
				{{ $t("notepad.types.folder") + "s" }}
			</div>
			<v-row>
				<v-col cols="12" md="3" v-for="folder in folderContent.folders" :key="folder.id">
					<Folder :folder="folder" :parent-path="folderPath" @open-folder="openFolder(folder)"></Folder>
				</v-col>
			</v-row>
		</div>
		<div class="my-3">
			<div class="mb-4 py-3 text-h6">{{ $t("notepad.types.file") + "s" }}</div>
			<!-- <LayoutTabContent :category="noteCategory" /> -->
			<v-row>
				<v-col cols="12" md="3" v-for="file in folderContent.files" :key="file.id">
					<CardContainer :item-data="file"></CardContainer>
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";

import FolderVue from "./Folder.vue";
// import LayoutTabContent from "./layouts/LayoutTabContent.vue";
import CardContainer from "@/components/cards/CardContainer.vue";

import { CardCategory, FileTreeNode, Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";

interface BreadcrumbItem {
	text: string;
	to: {
		name: string;
		params?: object;
	};
	disabled?: boolean;
	exact: true;
}

export default Vue.extend({
	components: {
		Folder: FolderVue,
		CardContainer,
		// LayoutTabContent,
	},
	props: {
		routeName: {
			type: String,
			required: true,
		},
		folderPath: {
			type: String,
			required: true,
		},
	},
	methods: {
		openFolder(folder: Folder) {
			this.$router.push({
				name: this.routeName,
				params: { folderPath: utilities.joinPaths(false, this.folderPath, folder.name.toLowerCase()) },
			});
		},
		getChildrenCount(folder: Folder) {
			const fullPath = utilities.joinPaths(true, this.folderPath, folder.name);
			const content: FileTreeNode = this.$store.getters.getFolderContent(fullPath);
			return content ? content.folders.length + content.folders.length : 0;
		},
	},
	computed: {
		noteCategory() {
			return CardCategory.Note;
		},
		folderIcon() {
			return Icon.folder;
		},
		folderContent(): Folder {
			const sanitized = utilities.sanitizePath(true, this.folderPath);
			return this.$store.getters.getFolderContent(sanitized);
		},
		breadcrumbs() {
			const splitPath = this.folderPath.split("/").filter((e) => e.length > 0);
			if (splitPath.length < 1) return [];

			const root: BreadcrumbItem = {
				text: this.$t("pages.notepad"),
				to: { name: this.routeName },
				disabled: false,
				exact: true,
			};

			const nextItems: BreadcrumbItem[] = splitPath.map((pathElement, idx, arr) => {
				const pathToCurrentElement = arr.slice(0, idx + 1).join("/");
				return {
					text: pathElement,
					to: { name: this.routeName, params: { folderPath: pathToCurrentElement } },
					disabled: idx === arr.length - 1,
					exact: true,
				};
			});

			return [root, ...nextItems];
		},
	},
});
</script>

<style></style>
