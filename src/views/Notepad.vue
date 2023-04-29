<template>
	<Banner>
		<template #actions>
			<NotepadActions
				:disabled="folder === undefined"
				@new-folder="newFolder"
				@new-file="newFile"
			/>
		</template>
	</Banner>

	<NotepadContent v-if="folder !== undefined" :folder="folder" />
	<div v-else class="my-3 text-center">
		<div class="text-xl-h4 my-3">
			{{ $t("notepad.folderNotFound.title") }}
		</div>
		<p>
			{{ $t("notepad.folderNotFound.message") }}
			<router-link :to="{ name: 'Notepad' }">
				{{ $t("pages.notepad") }}
			</router-link>
		</p>
	</div>

	<FolderDialog v-if="folder !== undefined" v-model="showFolderDialog" :parent="folder" />
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import NotepadActions from "@/components/layout/banner/actions/NotepadActions.vue";
import Banner from "@/components/layout/banner/Banner.vue";
import FolderDialog from "@/components/notepad/FolderDialog.vue";
import NotepadContent from "@/components/notepad/NotepadContent.vue";
import { CardCategory } from "@/core/model/cards";
import { File, Path } from "@/core/model/fileTree";
import { t as $t } from "@/core/translation";
import utilities from "@/core/utilities";
import { useNotepadStore } from "@/store/notepad";

// These props are passed to the component directly by vue-router
const props = defineProps<{
	folderPath: Path;
}>();

const showFolderDialog = ref(false);

const notepadStore = useNotepadStore();

function newFolder(): void {
	showFolderDialog.value = true;
}

function newFile(): void {
	// ! MOCKUP DATA
	// TODO
	const note: File = {
		_category: CardCategory.Note,
		id: utilities.uid(),
		desc: "",
		tags: [],
		title: "Note A",
	};

	notepadStore.addFile(props.folderPath, note);
}

const folder = computed(() => notepadStore.getFolder(props.folderPath));
</script>
