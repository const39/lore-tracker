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
		></NotepadContent>
		<div v-else class="my-3 text-center">
			<div class="text-xl-h4 my-3">{{ $t("notepad.folderNotFound.title") }}</div>
			<p>
				{{ $t("notepad.folderNotFound.message") }}
				<router-link :to="{ name: routeName }">{{ $t("pages.notepad") }}</router-link>
			</p>
		</div>

		<FolderDialog v-model="showFolderDialog" :parent-path="folderPath"></FolderDialog>
		
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Banner from "@/components/banner/Banner.vue";
import NotepadActions from "@/components/banner/actions/NotepadActions.vue";
import NotepadContent from "@/components/notepad/NotepadContent.vue";
import FolderDialog from "@/components/notepad/FolderDialog.vue";

import utilities from "@/js/utilities";
// import { CardCategory, Folder, FileTypes } from "@/js/types";
import { CardCategory, FileTypes } from "@/js/types";

export default Vue.extend({
	components: {
		Banner,
		NotepadActions,
		NotepadContent,
		FolderDialog
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
	data() {
		return {
			showFolderDialog: false
		}
	},
	methods: {
		newFolder(): void {
			this.showFolderDialog = true;
		},
		newFile(): void {
			// ! MOCKUP DATA
			// TODO 
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
