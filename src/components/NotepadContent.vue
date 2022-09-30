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
			<v-col cols="12" md="3" v-for="folder in folderContent._folders" :key="folder.id">
				<v-card @dblclick="openFolder(folder)">
					<v-card-title class="d-flex">
						<v-icon x-large>mdi-folder</v-icon>
						<span class="mx-1 flex-grow-1">
							{{ folder.name }}
						</span>
						<v-avatar class="text-caption" size="20" color="grey">
							{{ folder.children.length || "0" }}
						</v-avatar>
					</v-card-title>
				</v-card>
			</v-col>
		</v-row>
		<div class="my-3 text-h6">Files</div>
		<v-row>
			<v-col cols="12" md="3" v-for="file in folderContent._files" :key="file.id">
				<CardContainer :item-data="file"></CardContainer>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	props: {
		folderContent: {
			type: Object, // TODO type with Folder interface
			required: true,
		},
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
		openFolder(folder) {
			this.$emit("folder-open", folder);
		},
	},
	computed: {
		breadcrumbs() {
			const breadcrumbItems = [];

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
