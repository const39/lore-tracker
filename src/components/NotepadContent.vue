<template>
	<v-container>
        <!-- DEBUG -->
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
						<v-icon x-large>mdi-folder</v-icon>
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

export default Vue.extend({
	components: {
		CardContainer
	},
	props: {
		// folderContent: {
		// 	type: Object as PropType<FileTreeNode>,
		// 	required: true,
		// },
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
			const fullPath = utilities.joinPaths(this.folderPath, folder.name);
			const content: FileTreeNode = this.$store.getters.getFolderContent(fullPath);
			return content ? content.folders.length + content.folders.length : 0;
		}
	},
	computed: {
		
		folderContent(): Folder {
			return this.$store.getters.getFolderContent(this.folderPath);
		},
		breadcrumbs() {
			const breadcrumbItems = [];

			// TODO rewrite using map() + fix vue-router warning

			if (this.folderPath) {
				breadcrumbItems.push({
					text: "ROOT", // TODO change + translate
					to: { name: this.routeName },
					disabled: false,
					exact: true,
				});

				const splitPath = this.folderPath.split("/");
				for (let i = 0; i < splitPath.length; i++) {
					breadcrumbItems.push({
						text: splitPath[i],
						to: { name: this.routeName, params: { folderPath: splitPath.slice(0, i + 1).join("/") } },
						disabled: i === splitPath.length - 1,
						exact: true,
					});
				}
			}
			return breadcrumbItems;
		},
	},
});
</script>

<style></style>
