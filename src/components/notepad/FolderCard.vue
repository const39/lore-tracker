<template>
	<div>
		<v-hover v-if="!editMode" v-slot="{ hover }">
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
					<v-fade-transition>
						<v-icon v-if="hover" class="mx-2" @click="editMode = true">mdi-pencil</v-icon>
					</v-fade-transition>
				</v-card-title>
			</v-card>
		</v-hover>
		<FolderForm
			v-else
			:parent-path="parentPath"
			:edit="folder"
			@close="editMode = false"
			@submit="editMode = false"
		></FolderForm>
	</div>
</template>

<script lang="ts">
import FolderForm from "./FolderForm.vue";
import Vue, { PropType } from "vue";

import { FileTreeNode, Folder, Icon } from "@/js/types";
import utilities from "@/js/utilities";

export default Vue.extend({
	components: {
		FolderForm,
	},
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
	data() {
		return {
			editMode: false,
		};
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
