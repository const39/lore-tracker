<template>
	<Banner>
		<template v-slot:actions>
			<NotepadActions :disabled="!doesFolderExist" @new-folder="newFolder" @new-file="newFile"></NotepadActions>
		</template>
	</Banner>

	<NotepadContent v-if="doesFolderExist" :route-name="routeName" :folder-path="folderPath"></NotepadContent>
	<div v-else class="my-3 text-center">
		<div class="text-xl-h4 my-3">{{ $t("notepad.folderNotFound.title") }}</div>
		<p>
			{{ $t("notepad.folderNotFound.message") }}
			<router-link :to="{ name: routeName }">{{ $t("pages.notepad") }}</router-link>
		</p>
	</div>

	<FolderDialog v-model="showFolderDialog" :parent-path="folderPath"></FolderDialog>
</template>

<script lang="ts" setup>
import { t as $t } from "@/js/translation";
import { computed, ref } from "vue";

import Banner from "@/components/banner/Banner.vue";
import NotepadActions from "@/components/banner/actions/NotepadActions.vue";
import FolderDialog from "@/components/notepad/FolderDialog.vue";
import NotepadContent from "@/components/notepad/NotepadContent.vue";

import { CardCategory, FileTypes } from "@/js/types";
import utilities from "@/js/utilities";
import { useNotepadStore } from "@/store/notepad";

const props = defineProps<{
	// These props are passed to the component directly by vue-router
	routeName: string;
	folderPath: string;
}>();

const showFolderDialog = ref(false);

const notepadStore = useNotepadStore();

function newFolder(): void {
	showFolderDialog.value = true;
}

function newFile(): void {
	// ! MOCKUP DATA
	// TODO
	const note: FileTypes = {
		_category: CardCategory.Note,
		id: utilities.uid(),
		desc: "",
		tags: [],
		title: "Note A",
	};

	notepadStore.addFile({ pathToParent: props.folderPath, file: note });
}

const doesFolderExist = computed(() => {
	const sanitized = utilities.sanitizePath(true, props.folderPath);
	return notepadStore.doesFolderExist(sanitized);
});
</script>
