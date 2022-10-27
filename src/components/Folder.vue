<template>
	<v-card @dblclick="openFolder(folder)">
		<v-card-title class="d-flex">
			<v-icon x-large :color="folder.color">{{ folderIcon }}</v-icon>
			<div class="mx-1 flex-grow-1">
				<span class="px-1 text-subtitle-1"> {{ folder.name }} </span>
			</div>
			<v-tooltip bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-avatar class="text-caption" size="20" color="grey" v-bind="attrs" v-on="on">
						{{ childrenCount }}
					</v-avatar>
				</template>
				<span>{{ childrenCount + $t("notepad.folder.childElements") }}</span>
			</v-tooltip>
		</v-card-title>
	</v-card>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { FileTreeNode, Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";
export default Vue.extend({
	props: {
		folder: {
			type: Object as PropType<Folder>,
			required: true,
		},
		parentPath: {
			type: String,
			required: true,
		},
	},
	methods: {
		openFolder(folder: Folder) {
			this.$emit("open-folder", folder);
		},
	},
	computed: {
		folderIcon() {
			return Icon.folder;
		},
		childrenCount(): number {
			const fullPath = utilities.joinPaths(true, this.parentPath, this.folder.name);
			const content: FileTreeNode = this.$store.getters.getFolderContent(fullPath);
			return content ? content.folders.length + content.files.length : 0;
		},
	},
});
</script>

<style></style>
