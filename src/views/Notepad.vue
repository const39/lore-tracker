<template>
	<v-container>
		<Banner>
			<template v-slot:actions>
				<NotepadActions
					:disabled="!doesFolderExist"
					@new-folder="newFolder"
					@new-file="newFile"
				></NotepadActions>
			</template>
		</Banner>

		<NotepadContent
			v-if="doesFolderExist"
			:route-name="routeName"
			:folder-path="folderPath"
			@folder-open="openFolder"
		></NotepadContent>
		<div v-else>
			INEXISTANT FOLDER	
			<!-- TODO translate -->
		</div>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Banner from "@/components/banner/Banner.vue";
import NotepadActions from "@/components/banner/actions/NotepadActions.vue";
import NotepadContent from "@/components/NotepadContent.vue";

import utilities from "@/js/utilities";
import { CardCategory, Folder, FileTypes } from "@/js/types";

export default Vue.extend({
	components: {
		Banner,
		NotepadActions,
		NotepadContent,
	},
	props: {
		// These props are passed to the component directly by vue-router
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
		newFolder(): void {
			// ! MOCKUP DATA
			// TODO when adding new folder, check if there's not already a folder with the same name
			const folder: Folder = {
				id: utilities.uid(),
				name: "Blabla",
				color: "green",
			};
			this.$store.dispatch("commitAndSave", {
				commit: "addFolder",
				payload: { pathToParent: this.folderPath, folder },
			});
		},
		newFile(): void {
			// ! MOCKUP DATA
			const note: FileTypes = {
				_category: CardCategory.Note,
				id: utilities.uid(),
				desc: "",
				tags: [],
				title: "Note A",
			};
			this.$store.dispatch("commitAndSave", {
				commit: "addFile",
				payload: { pathToParent: this.folderPath, file: note },
			});
		},
	},
	computed: {
		doesFolderExist(): boolean {
			const sanitized = utilities.sanitizePath(true, this.folderPath);
			return this.$store.getters.doesFolderExist(sanitized);
		},
	},
});
</script>
