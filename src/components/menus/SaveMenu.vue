<template>
	<MenuActivator
		:close-on-content-click="false"
		:title="$t('options.save.optionName')"
		icon="mdi-content-save"
	>
		<v-list density="compact">
			<v-list-item prepend-icon="mdi-download" @click="downloadSave">
				<v-list-item-title>{{ $t("options.save.downloadText") }}</v-list-item-title>
			</v-list-item>
			<v-list-item prepend-icon="mdi-upload" @click="showUploadDialog = true">
				<v-list-item-title>{{ $t("options.save.uploadText") }}</v-list-item-title>
			</v-list-item>
			<v-list-item prepend-icon="" @click="confirmDeletion">
				<template #prepend>
					<v-icon color="red" icon="mdi-delete" />
				</template>
				<v-list-item-title class="text-red">
					{{ $t("options.save.deleteText") }}
				</v-list-item-title>
			</v-list-item>
		</v-list>
	</MenuActivator>

	<!-- Save file upload dialog -->
	<v-dialog v-model="showUploadDialog" max-width="450" persistent>
		<v-card>
			<v-card-title class="text-h5">
				{{ $t("options.save.uploadText") }}
			</v-card-title>
			<v-card-text>
				<v-file-input
					v-model="uploadedFile"
					:label="$t('options.save.uploadInputLabel')"
					:messages="$t('options.save.uploadInputHint')"
					variant="outlined"
					accept="application/json"
				/>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showUploadDialog = false">
					{{ $t("actions.close") }}
				</v-btn>
				<v-btn variant="text" color="primary" @click="uploadSave">
					{{ $t("actions.save") }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { isLocalisableError } from "@/core/error";
import eventBus from "@/core/eventBus";
import { deleteSave, exportSaveToFile, importSave } from "@/core/save";
import { t as $t } from "@/core/translation";
import { useGlobalConfirmDialog } from "@/store/confirmDialog";
import { useGlobalSnackbar } from "@/store/snackbar";
import MenuActivator from "./MenuActivator.vue";

const uploadedFile = ref<File[]>([]); // v-file-input only accepts an array of files
const showUploadDialog = ref(false);

const router = useRouter();
const { showSnackbar } = useGlobalSnackbar();
const { showConfirmDialog } = useGlobalConfirmDialog();

async function downloadSave() {
	const file = await exportSaveToFile();
	const a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = `LoreTracker_backup_${new Date().toLocaleDateString()}.json`;
	a.click();
}

async function uploadSave() {
	// v-file-input only accepts an array of files, but we do not use the 'multiple' prop
	// so we only use the first element in the array
	if (uploadedFile.value.length) {
		try {
			// Read file content and import the save
			const fileContent = await uploadedFile.value[0].text();
			await importSave(fileContent);
			onDataChange();

			// Success feedback
			showSnackbar({
				message: $t("messages.success.saveFileImportSuccessful"),
				timeout: 7000,
				color: "success",
			});
		} catch (err) {
			console.error(err);

			// If a user-friendly error message is provided, use it. Otherwise, use a default one
			const errorCause = isLocalisableError(err)
				? err.toLocaleString()
				: $t("messages.errors.genericError");

			// Show the full error message
			const message = `${$t("messages.errors.saveFileImportCancelled")} : ${errorCause}`;
			showSnackbar({
				message,
				timeout: 10000,
				color: "error",
			});
		} finally {
			// Reset upload form state
			uploadedFile.value = [];
			showUploadDialog.value = false;
		}
	}
}

function onDataChange() {
	// Redirect user to the current category's root folder (because if we're in a custom folder, it will not exist in the new save file)
	router.push({ params: { folderId: undefined } });
	// Trigger whole app update
	eventBus.emit("data-loaded");
}

function confirmDeletion() {
	showConfirmDialog({
		title: $t("options.save.deleteDialogTitle"),
		message: $t("options.save.deleteDialogMessage"),
		confirmAction: async () => {
			await deleteSave();
			onDataChange();
		},
	});
}
</script>
