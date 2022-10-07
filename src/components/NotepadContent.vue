<template>
	<v-container>
		<!-- TODO remove -->
		CONTENT : {{ folderContent }}<br />
		ROUTE : {{ routeName }}<br />
		PATH : {{ folderPath }}<br />
		BREAD : {{ breadcrumbs }}
		<v-breadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs">
			<template v-slot:divider>
				<v-icon>mdi-chevron-right</v-icon>
			</template>
		</v-breadcrumbs>
		<div class="my-3 text-h6">Folders</div>
		<v-row>
			<v-col cols="12" md="3" v-for="folder in folderContent.folders" :key="folder.id">
				<v-card @dblclick="openFolder(folder)">
					<v-card-title class="d-flex">
						<v-icon x-large :color="folder.color">mdi-folder</v-icon>
						<span class="mx-1 flex-grow-1">
							{{ folder.name }}
						</span>
						<v-avatar class="text-caption" size="20" color="grey">
							{{ getChildrenCount(folder) }}
						</v-avatar>
					</v-card-title>
				</v-card>
			</v-col>
		</v-row>
		<div class="my-3 text-h6">Files</div>
		<v-row>
			<v-col cols="12" md="3" v-for="file in folderContent.files" :key="file.id">
				<CardContainer :item-data="file"></CardContainer>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";
// import Vue, { PropType } from "vue";

import CardContainer from "@/components/cards/CardContainer.vue";
import { FileTreeNode, Folder } from "@/js/types";
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
		CardContainer,
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
			this.$emit("folder-open", folder);
		},
		getChildrenCount(folder: Folder) {
			const fullPath = utilities.joinPaths(true, this.folderPath, folder.name);
			const content: FileTreeNode = this.$store.getters.getFolderContent(fullPath);
			return content ? content.folders.length + content.folders.length : 0;
		},
	},
	computed: {
		folderContent(): Folder {
			const sanitized = utilities.sanitizePath(true, this.folderPath)
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
