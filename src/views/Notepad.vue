<template>
	<v-container>
		<Banner>
			<template v-slot:actions>
				<NotepadActions @new-folder="newFolder" @new-file="newFile"></NotepadActions>
			</template>
		</Banner>

		<NotepadContent
			:folder-content="folderContent"
			:route-name="routeName"
			:folder-path="folderPath"
			@folder-open="openFolder"
		></NotepadContent>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";

import Banner from "@/components/banner/Banner.vue";
import NotepadActions from "@/components/banner/actions/NotepadActions.vue";
import NotepadContent from "@/components/NotepadContent.vue";

import utilities from "@/js/utilities";
import { CardCategory, Note } from "@/js/types";

interface Folder {
	id: number;
	name: string;
	color: string;
	children: FileTreeNode;
}

interface FileTreeNode {
	_folders: Folder[];
	_files: Note[];
}

export default Vue.extend({
	components: {
		Banner,
		NotepadActions,
		NotepadContent,
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
	data() {
		return {
			MOCKUP: (this as any).init(),
		};
	},
	methods: {
		openFolder(folder: Folder) {
			this.$router.push({
				name: this.routeName,
				params: { folderPath: this.folderPath + folder.name.toLowerCase() },
			});
		},
		newFolder(): void {
			// ! MOCKUP DATA
			// TODO when adding new folder, check if there's not already a folder with the same name
			const folder: Folder = {
				id: utilities.uid(),
				name: "Blabla",
				color: "green",
				children: {
					_folders: [],
					_files: [],
				},
			};
			this.MOCKUP._folders.push(folder);
			this.save();
		},
		newFile(): void {
			// ! MOCKUP DATA
			const note: Note = {
				_category: CardCategory.Note,
				id: utilities.uid(),
				desc: "",
				tags: [],
				title: "Note A",
			};
			this.MOCKUP._files.push(note);
			this.save();
		},
		init(): FileTreeNode {
			// ! MOCKUP DATA
			const data = localStorage.getItem("MOCKUP_NOTEPAD");
			if (data) return JSON.parse(data);
			else
				return {
					_folders: [],
					_files: [],
				};
		},
		save() {
			// ! MOCKUP DATA
			localStorage.setItem("MOCKUP_NOTEPAD", JSON.stringify(this.MOCKUP));
		},
	},
	computed: {
		folderContent() {
			let folder = this.MOCKUP as FileTreeNode;

			// Perform a search in file tree only if we're not at root URI (ie. /notepad)
			if(this.folderPath) {
				
				const splitFolderPath = this.folderPath.toLowerCase().split("/");
				for (const key of splitFolderPath) {
					console.log("Searching " + key + " in ");
					console.log(folder);
	
					const searchedFolder = folder._folders.find((elem) => elem.name.toLowerCase() === key);
					if (searchedFolder) folder = searchedFolder.children;
					else {
						console.error(key + " NOT FOUND IN FOLDER");
						break;
					}
				}
			}

			return folder;
		},
	},
});
</script>
